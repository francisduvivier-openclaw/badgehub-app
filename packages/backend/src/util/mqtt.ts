import { BadgeHubData } from "@domain/BadgeHubData";
import { getAndAssertEnv } from "@shared/config/sharedConfig";
import mqtt from "mqtt";

export async function startMqtt(badgeHubData: BadgeHubData) {
  const nodeEnv = getAndAssertEnv("NODE_ENV");

  if (nodeEnv == "development") {
    console.log("Not publishing to MQTT in development environment");
    return;
  }

  if (process.env.NODE_APP_INSTANCE !== "0") {
    return;
  }

  const username = getAndAssertEnv("MQTT_USER");
  const password = getAndAssertEnv("MQTT_PASSWD");
  const topic = getAndAssertEnv("MQTT_TOPIC");
  const server = getAndAssertEnv("MQTT_SERVER");
  const interval = getAndAssertEnv("MQTT_INTERVAL_SEC");

  if (!server) {
    console.log("MQTT_SERVER not set");
    return;
  }

  console.log("MQTT: ready to connect");

  try {
    let client = mqtt.connect(server, {
      username,
      password,
      clean: true,
    });

    async function sendMqttMessage() {
      const stats = await badgeHubData.getStats();

      console.log("MQTT: send message");
      try {
        client.publish(
          topic,
          JSON.stringify({ ...stats, timestamp: new Date().toISOString() }),
          { qos: 1, retain: true }
        );
      } catch (error) {
        console.error(`MQTT: error publishing message`, error);
      }
    }

    client.on("connect", async () => {
      console.log("MQTT: connected to server");

      sendMqttMessage();
      setInterval(sendMqttMessage, Number(interval) * 1000);
    });
  } catch (error) {
    console.error(`MQTT: error connecting to server ${server}`, error);
  }
}
