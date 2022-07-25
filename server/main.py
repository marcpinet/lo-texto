# ------------------------------IMPORTS------------------------------


import paho.mqtt.client as mqtt
import base64
import binascii
import os


# ------------------------------GLOBAL VARIABLES------------------------------

# Quality of Service :
# 0 = sent at most once,
# 1 = sent at least once,
# 2 = sent until acknowledged (kind of handshake)
QOS = 0

# Findable in the TTN Application Overview tab and around (V3)
TTN_APP_ID = "lorawan-test-stage@ttn"
TTN_API_KEY = "NNSXS.CJSXORVTBM2DMPGTDLWSWASMAGKA7QJPIC7EHOY.D24WO7IV72YZTBPJGPF72OXBEM7NKRSX363RBWPUCG6KYVGH3OTQ"
TTN_HOSTNAME = "eu1.cloud.thethings.network"
TTN_PORT = 8883

# Name of the database where received uplinks infos will be stored
DB_NAME = "ttn"

# Prints enabled
DEBUG = True


# ------------------------------GLOBAL FUNCTIONS------------------------------


def bytes_to_ascii(bytes: list, separator: str = '|') -> str:
    """Converts a list of bytes into a string, removes the first separator and take the left part

    Args:
        bytes (list): A list of bytes

    Returns:
        str: A string representing the bytes
    """
    a = ''.join([chr(c) for c in bytes]).split(separator)[0]
    if DEBUG:
        print(f"bytes={bytes}, ascii={a}")
    return a


def add_to_database(payload: dict) -> bool:
    """Parse the payload into a SQL query and send it to the database

    Args:
        payload (dict): The payload received from the TTN API

    Returns:
        bool: Whether the operation succeed or not
    """
    uplink_token = payload["uplink_message"]["rx_metadata"][0]["uplink_token"]
    time = payload["uplink_message"]["rx_metadata"][0]["time"].split(
        "T")[0] + " " + payload["uplink_message"]["rx_metadata"][0]["time"].split("T")[1].split(".")[0]
    decoded_message = bytes_to_ascii(
        payload["uplink_message"]["decoded_payload"]["bytes"])
    device_id = payload["end_device_ids"]["device_id"]
    device_eui = payload["end_device_ids"]["dev_eui"]
    device_address = payload["end_device_ids"]["dev_addr"]
    application_id = payload["end_device_ids"]["application_ids"]["application_id"]
    gateway_id = payload["uplink_message"]["rx_metadata"][0]["gateway_ids"]["gateway_id"]

    msg_ids = tuple([int(x, 16) for x in decoded_message])
    if len(msg_ids) <= 1:
        msg_ids = f"({msg_ids[0]})"

    # Preparing the select statement
    select_statement = f"""
        SELECT message FROM Message where message_id IN {msg_ids};
    """

    # Storing the query output to the result.txt file
    os.system(
        f"echo \"{select_statement}\" | sudo mysql ttn > /home/tvlic/query/result.txt")

    # Retrieving the result from the file
    full_message = None
    with open("/home/tvlic/query/result.txt", "r") as f:
        lines = f.readlines()
        full_message = ". ".join(lines[1:]).replace('\n', '') + '.'

    # Preparing the insert statement
    insert_statement = f"""
        INSERT INTO Payload VALUES ('{uplink_token}', '{time}', '{full_message}', '{device_id}', '{device_eui}', '{device_address}', '{application_id}', '{gateway_id}');
    """

    if DEBUG:
        print(select_statement, insert_statement, sep='\n')

    os.system(f"""
        echo "{insert_statement}" | sudo mysql ttn > /home/tvlic/query/logs.txt;
        """)

    return True


def on_message(client, userdata, msg):
    """Callback function when a message is received from TTN"""

    # Getting the payload, parsing it and sending it to the database
    payload_as_dict = eval(msg.payload.decode("UTF-8").replace("true", "True"))

    # Adding to the database the payload and its content
    try:
        add_to_database(payload_as_dict)

        send_downlink(client, payload_as_dict)

    except Exception as e:
        if DEBUG:
            print("Error at:", e)


def send_downlink(client: mqtt.Client, payload: dict):
    """Send a downlink message to the TTN API"""

    fport = 3

    # Converting payload content (array of int) to string (ascii) and then to hexadecimal
    hexadecimal_payload = binascii.hexlify(
        bytes(bytes_to_ascii(payload["uplink_message"]["decoded_payload"]["bytes"]), encoding='utf-8')).decode()

    # Target end_device_id /// TODO : CURRENTLY DEVICE_ID IS STATIC, WE NEED TO FIND A WAY TO MAKE IT CHANGEABLE
    end_device_id = "node2"

    # Preparing the downlink message's topic (channel where it will be sent)
    topic = "v3/" + TTN_APP_ID + "/devices/" + \
        end_device_id + "/down/push"

    # Convert hexadecimal payload to base64
    base64_payload = base64.b64encode(
        bytes.fromhex(hexadecimal_payload)).decode()

    # Publishing downlink
    msg = '{"downlinks":[{"f_port":' + \
        str(fport) + ',"frm_payload":"' + \
        base64_payload + '","priority": "NORMAL"}]}'
    client.publish(topic, msg, QOS)


# ------------------------------MAIN FUNCTION------------------------------


def main():

    while True:
        try:
            # Creating client
            client = mqtt.Client()
            client.on_message = on_message
            client.username_pw_set(TTN_APP_ID, TTN_API_KEY)

            # IMPORTANT - this enables the encryption of messages
            client.tls_set()

            # Connecting to the broker
            client.connect(TTN_HOSTNAME, TTN_PORT)

            # Subscribing to ALL topics
            client.subscribe("#", QOS)

            # Looping for ever
            client.loop_forever()
            
        except:
            continue


# ------------------------------MAIN CALL------------------------------


if __name__ == "__main__":
    main()
