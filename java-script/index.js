import Ably from 'ably';

document.addEventListener('DOMContentLoaded', () => {
    const voltageDiv = document.getElementById('voltage');
    const currentDiv = document.getElementById('current');
    const powerDiv = document.getElementById('power');
    const energyDiv = document.getElementById('energy');

    // Initialize Ably with your API key
    const ably = new Ably.Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
    const channel = ably.channels.get('voltage-data');

    // Subscribe to messages from the Ably channel
    channel.subscribe('new-data', (message) => {
        try {
            const data = message.data;
            voltageDiv.textContent = data.voltage;
            currentDiv.textContent = data.current;
            powerDiv.textContent = data.power;
            energyDiv.textContent = data.energy;
        } catch (e) {
            console.error('Error processing Ably message:', e);
        }
    });
});
