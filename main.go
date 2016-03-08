package main

import (
	"os"
	"runtime"
	"syscall"

	log "github.com/unchartedsoftware/plog"
	"github.com/unchartedsoftware/prism/generation/elastic"
	"github.com/unchartedsoftware/prism/generation/meta"
	"github.com/unchartedsoftware/prism/generation/tile"
	"github.com/unchartedsoftware/prism/store"
	"github.com/unchartedsoftware/prism/store/redis"
	"github.com/zenazn/goji/graceful"

	"github.com/unchartedsoftware/census-hackathon-2016/api"
)

var (
	port      = "8080"
	esHost    = "http://localhost"
	esPort    = "9200"
	redisHost = "localhost"
	redisPort = "6379"
)

func main() {
	// sets the maximum number of CPUs that can be executing simultaneously
	runtime.GOMAXPROCS(runtime.NumCPU())

	// override defaults via env vars
	if os.Getenv("ES_HOST") != "" {
		esHost = os.Getenv("ES_HOST")
	}
	if os.Getenv("ES_PORT") != "" {
		esPort = os.Getenv("ES_PORT")
	}
	if os.Getenv("REDIS_HOST") != "" {
		redisHost = os.Getenv("REDIS_HOST")
	}
	if os.Getenv("REDIS_PORT") != "" {
		redisPort = os.Getenv("REDIS_PORT")
	}

	// log endpoints
	log.Infof("Redis endpoint set to %s:%s", redisHost, redisPort)
	log.Infof("Elasticsearch endpoint set to %s:%s", esHost, esPort)

	// register available tiling types
	tile.Register("heatmap", elastic.NewHeatmapTile(esHost, esPort))
	tile.Register("topic_count", elastic.NewTopCountTile(esHost, esPort))
	// register available meta data types
	meta.Register("default", elastic.NewDefaultMeta(esHost, esPort))
	// register available store types
	store.Register("redis", redis.NewConnection(redisHost, redisPort))

	// create server
	app := api.New()

	// catch kill signals for graceful shutdown
	graceful.AddSignal(syscall.SIGINT, syscall.SIGTERM)
	// start server
	log.Infof("Prism server listening on port %s", port)
	err := graceful.ListenAndServe(":"+port, app)
	if err != nil {
		log.Error(err)
	}
	// wait until server gracefully exits
	graceful.Wait()
}
