export default {
    async fetch(request, env) {
        // Se supone que no hace falta todo esto porque lo configure para que 
        // este script solo corra cuando la url es /api/*
        // const url = new URL(request.url);

        // if (url.pathname.startsWith("/api/")) {
        //     // etc
        // }
        const pathname = (new URL(request.url)).pathname.split("/").slice(2);
        if (pathname.length > 0) {
            if (pathname[0] = "matle") {
                const fetchDay = async (day) => 
                    await env.MATLE_DB
                        .prepare("SELECT * FROM day WHERE day_number = ?")
                        .bind(day)
                        .run();

                const fetchLastDay = async () =>
                    await env.MATLE_DB
                        .prepare("SELECT MAX(day_number), * FROM day;")
                        .run();

                let day = (pathname.length > 1 && parseInt(pathname[1]))
                        ? await fetchDay(parseInt(pathname[1]))
                        : await fetchLastDay();

                if (day.results.length = 0) day = fetchLastDay();

                return new Response(JSON.stringify(day.results[0]), {
                    headers: { "Content-Type": "application/json" }
                });
            }
        }
    }
}
