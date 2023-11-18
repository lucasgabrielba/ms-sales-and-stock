import axios from "axios";

interface NotificationData {
  message: string,
  type: string,
  number: string,
  companyId: string,
}

export class NotificationApplicationService {
  private notification_url = process.env.NOTIFICATION_URL;

  async createNotification(data: NotificationData, access_token: string): Promise<boolean> {
    console.log(access_token)
    const result = await axios.post(
      this.notification_url,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': access_token,
        },
      },
    )

    if (result.status !== 200) {
      return false;
    }

    return true;
  }
}