export default {
    async fetch(request, env) {
        // Se supone que no hace falta todo esto porque lo configure para que 
        // este script solo corra cuando la url es /api/*
        // const url = new URL(request.url);

        // if (url.pathname.startsWith("/api/")) {
        //     // etc
        // }
        return new Response(JSON.stringify({ cosa: "Gaming" }), {
            headers: { "Content-Type": "application/json" },
        });
    }
}
