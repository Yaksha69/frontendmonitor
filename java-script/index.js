document.addEventListener('DOMContentLoaded', () => {
    const voltageDiv = document.getElementById('voltage');
    const currentDiv = document.getElementById('current');
    const powerDiv = document.getElementById('power');
    const energyDiv = document.getElementById('energy');

    // Create a new EventSource instance to connect to your backend SSE endpoint
    const eventSource = new EventSource('https://backendmonitors-pxak-qtamft78c-terdys-projects.vercel.app/api/v1/data/events');

    // Listen for messages from the SSE stream
    eventSource.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data); // Parse the incoming data
            // Update the HTML elements with the data
            voltageDiv.textContent = data.voltage;
            currentDiv.textContent = data.current;
            powerDiv.textContent = data.power;
            energyDiv.textContent = data.energy;
        } catch (e) {
            console.error('Error processing SSE message:', e);
        }
    };

    // Handle connection errors
    eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
    };
});
