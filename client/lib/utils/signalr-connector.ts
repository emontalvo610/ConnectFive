import * as signalR from "@microsoft/signalr";

class Connector {
  private URL: string;
  private connection: signalR.HubConnection;
  static instance: Connector;

  constructor(URL: URL) {
    this.URL = String(URL);
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.URL)
      .withAutomaticReconnect()
      .build();
  }

  public on = (channel: string, callback: (data: any) => void) => {
    this.connection.start().catch((err) => document.write(err));
    this.connection.on(channel, (data: any) => {
      callback(data);
    });
  };

  public off = (channel: string) => {
    this.connection.off(channel);
  };

  public emit = (channel: string, data: any) => {
    this.connection.send(channel, data).then((x) => console.log("sent"));
  };

  public static getInstance(URL: URL): Connector {
    if (!Connector.instance) Connector.instance = new Connector(URL);
    return Connector.instance;
  }
}
export default Connector.getInstance;

export const createSocket = (URL: URL) => {
  return new Connector(URL);
};
