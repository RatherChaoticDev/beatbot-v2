const matchmakingDomains = {
    "fortnite-matchmaking-public-service-live-oce.ol.epicgames.com": "https://cors-anywhere.herokuapp.com/fortnite-matchmaking-public-service-live-oce.ol.epicgames.com",
    "fortnite-matchmaking-public-service-live-nae.ol.epicgames.com": "https://cors-anywhere.herokuapp.com/fortnite-matchmaking-public-service-live-nae.ol.epicgames.com",
    "fortnite-matchmaking-public-service-live-nac.ol.epicgames.com": "https://cors-anywhere.herokuapp.com/fortnite-matchmaking-public-service-live-nac.ol.epicgames.com",
    "fortnite-matchmaking-public-service-live-naw.ol.epicgames.com": "https://cors-anywhere.herokuapp.com/fortnite-matchmaking-public-service-live-naw.ol.epicgames.com",
    "fortnite-matchmaking-public-service-live-eu.ol.epicgames.com": "https://cors-anywhere.herokuapp.com/fortnite-matchmaking-public-service-live-eu.ol.epicgames.com",
    "fortnite-matchmaking-public-service-live-br.ol.epicgames.com": "https://cors-anywhere.herokuapp.com/fortnite-matchmaking-public-service-live-br.ol.epicgames.com",
    "fortnite-matchmaking-public-service-live-asia.ol.epicgames.com": "https://cors-anywhere.herokuapp.com/fortnite-matchmaking-public-service-live-asia.ol.epicgames.com",
    "fortnite-matchmaking-public-service-live-me.ol.epicgames.com": "https://cors-anywhere.herokuapp.com/fortnite-matchmaking-public-service-live-me.ol.epicgames.com",
}

/**
 * 
 * @param {string} serviceUrl 
 * @param {Mcp.Ticket} ticket
 */
function getProxyUrl(serviceUrl, ticket) {
    const url = new URL(serviceUrl);

    if (url.hostname in matchmakingDomains) {
        url.hostname = matchmakingDomains[url.hostname];
    } else {
        throw new Error(`Unknown matchmaking domain ${url.hostname}. We don't have a proxy for this domain yet. Please report this to the developer.`);
    }

    const hash = generateMMSHash(ticket.payload, ticket.signature);
    url.search = `?Epic-Signed ${encodeURIComponent(ticket.ticketType)} ${encodeURIComponent(ticket.payload)} ${encodeURIComponent(ticket.signature)} ${encodeURIComponent(hash)}`;

    return url.toString();
}


class MatchmakingClient {
    /**
     * 
     * @param {Mcp.Ticket} ticket
     */
    constructor(ticket) {
        this.ticket = ticket;
    }

    /**
     * @private
     */
    ws;

    connect() {
        const proxyUrl = getProxyUrl(this.ticket.serviceUrl, this.ticket);
        this.ws = new WebSocket(proxyUrl);
        this.ws.onmessage = this.onMessage;
    }

    close() { this.ws.close(); }

    /**
     * @private
     * @param {MessageEvent} event 
     */
    onMessage(event) {
        const data = event.data.toString();
        const message = JSON.parse(data);
        console.log('MatchmakingService message:', message);
    }
}
