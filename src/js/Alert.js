export default class Alert {
  constructor(path = "/json/alerts.json") {
    this.path = path;
  }

  async init() {
    const alerts = await this.getAlerts();

    if (!Array.isArray(alerts)) {
      return;
    }

    const activeAlerts = alerts.filter((alert) => alert.enabled !== false);

    if (activeAlerts.length > 0) {
      this.renderAlerts(activeAlerts);
    }
  }

  async getAlerts() {
    const response = await fetch(this.path);

    if (!response.ok) {
      return [];
    }

    const alerts = await response.json();
    return alerts;
  }

  renderAlerts(alerts) {
    const main = document.querySelector("main");

    if (!main) {
      return;
    }

    const alertSection = document.createElement("section");

    alertSection.classList.add("alert-list");

    alerts.forEach((alert) => {
      if (!alert.message) {
        return;
      }

      const paragraph = document.createElement("p");

      paragraph.textContent = alert.message;
      paragraph.style.backgroundColor = alert.background;
      paragraph.style.color = alert.color;
      paragraph.dataset.alertType = alert.type || "general";

      alertSection.appendChild(paragraph);
    });

    if (alertSection.children.length > 0) {
      main.prepend(alertSection);
    }
  }
}
