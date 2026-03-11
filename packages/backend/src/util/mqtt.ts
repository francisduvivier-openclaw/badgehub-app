import { BadgeHubData } from "@domain/BadgeHubData";
import { getAndAssertEnv } from "@shared/config/sharedConfig";
import mqtt from "mqtt";

export async function startMqtt(badgeHubData: BadgeHubData) {
  const nodeEnv = getAndAssertEnv("NODE_ENV");

  if (nodeEnv == "development") {
    console.log("Not publishing to MQTT in development environment");
    return;
  }

  if (process.env.NODE_APP_INSTANCE !== '0') {
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

  let client = mqtt.connect(server, {
    username,
    password,
    clean: true,
  });

  client.on("connect", () => {
    console.log("Connected to MQTT server");
    setInterval(async () => {

      console.log('MQTT: send message');

      const stats = await badgeHubData.getStats();

      client.publish(
        topic,
        JSON.stringify({ ...stats, timestamp: new Date().toISOString() }),
        { qos: 1, retain: true }
      );
    }, Number(interval) * 1000);
  });
}
