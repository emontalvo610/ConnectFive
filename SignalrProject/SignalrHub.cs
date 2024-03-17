using Microsoft.AspNetCore.SignalR;
public class SignalrHub : Hub
{
    public async Task makeMove(object data)
    {
        await Clients.All.SendAsync("moveMade", data);
    }

    public async Task resetGame(object data)
    {
        await Clients.All.SendAsync("gameReset", data);
    }
}