document.addEventListener('DOMContentLoaded', () => {
    const voltageDiv = document.getElementById('voltage');
    const currentDiv = document.getElementById('current');
    const powerDiv = document.getElementById('power');
    const energyDiv = document.getElementById('energy');

    // Initialize Ably with your API key
    const ably = new Ably.Realtime({ key: 'Y3ohHg.BzTY8A:La8DQsFQ2_a1tgM5_TpnGet-1vGO8LAV4QTf2HikVdI' });  // Use your actual API key
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
