package api

import (
	"net/http"

	log "github.com/unchartedsoftware/plog"
	"github.com/unchartedsoftware/prism-server/middleware"
	"github.com/unchartedsoftware/prism-server/routes/dispatch"
	"github.com/unchartedsoftware/prism-server/routes/meta"
	"github.com/unchartedsoftware/prism-server/routes/tile"
	"github.com/zenazn/goji/web"
)

const (
	publicDir = "./build/public"
)

// New returns a new Goji Mux handler to process HTTP requests.
func New() http.Handler {
	r := web.New()
	// mount logger middleware
	r.Use(middleware.Log)
	// mount gzip middleware
	r.Use(middleware.Gzip)
	// meta dispatching websocket handler
	log.Debugf("Meta-Dispatch route: '%s'", dispatch.MetaRoute)
	r.Get(dispatch.MetaRoute, dispatch.MetaHandler)
	// tile dispatching websocket handler
	log.Debugf("Tile-Dispatch route: '%s'", dispatch.TileRoute)
	r.Get(dispatch.TileRoute, dispatch.TileHandler)
	// tile request handler
	log.Debugf("Tile route: '%s'", tile.Route)
	r.Post(tile.Route, tile.Handler)
	// metadata request handler
	log.Debugf("Meta route: '%s'", meta.Route)
	r.Get(meta.Route, meta.Handler)
	// add greedy route last
	r.Get("/*", http.FileServer(http.Dir(publicDir)))
	return r
}
