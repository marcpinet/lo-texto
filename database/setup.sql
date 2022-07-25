DROP DATABASE ttn;

CREATE DATABASE ttn;

USE ttn;

  CREATE TABLE Payload (
    uplink_token varchar(100) PRIMARY KEY NOT NULL,
    time datetime DEFAULT NULL,
    message varchar(100) DEFAULT NULL,
    device_id varchar(100) DEFAULT NULL,
    gateway_id varchar(100) DEFAULT NULL,
    device_eui varchar(100) DEFAULT NULL,
    device_address varchar(100) DEFAULT NULL,
    application_id varchar(100) DEFAULT NULL
);

/* Display an error but the create table works */
/*
CREATE TABLE Message (
  message_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  decoded_message varchar(100) DEFAULT NULL
);
*/

INSERT INTO Message(decoded_message) VALUES ('I am safe');
INSERT INTO Message(decoded_message) VALUES ('I am injured');
INSERT INTO Message(decoded_message) VALUES ('I am surrounded by people');
INSERT INTO Message(decoded_message) VALUES ('I am on the ground');
INSERT INTO Message(decoded_message) VALUES ('I am on a boat');
INSERT INTO Message(decoded_message) VALUES ('There is a storm');
INSERT INTO Message(decoded_message) VALUES ('I need help');
INSERT INTO Message(decoded_message) VALUES ('I am in danger');
INSERT INTO Message(decoded_message) VALUES ('I am bleeding');
INSERT INTO Message(decoded_message) VALUES ('I am a citizen of Da Nang');
INSERT INTO Message(decoded_message) VALUES ('I am under 18 years old');
INSERT INTO Message(decoded_message) VALUES ('I am a male');
INSERT INTO Message(decoded_message) VALUES ('I am a female');
