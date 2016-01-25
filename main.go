package main

import (
	"runtime"
	"syscall"

	log "github.com/unchartedsoftware/plog"
	"github.com/unchartedsoftware/prism-server/conf"
	"github.com/unchartedsoftware/prism/generation/elastic"
	"github.com/unchartedsoftware/prism/generation/meta"
	"github.com/unchartedsoftware/prism/generation/tile"
	"github.com/unchartedsoftware/prism/store"
	"github.com/unchartedsoftware/prism/store/redis"
	"github.com/zenazn/goji/graceful"

	"github.com/unchartedsoftware/census-hackathon-2016/api"
)

func main() {
	// sets the maximum number of CPUs that can be executing simultaneously
	runtime.GOMAXPROCS(runtime.NumCPU())

	// parse flags into config struct
	config := conf.ParseCommandLine()

	// register available tiling types
	tile.Register("heatmap", elastic.NewHeatmapTile)
	tile.Register("topiccount", elastic.NewTopicCountTile)
	tile.Register("topicfrequency", elastic.NewTopicFrequencyTile)
	// register available meta data types
	meta.Register("default", elastic.NewDefaultMeta)
	// register available store types
	store.Register("redis", redis.NewConnection)

	// create server
	app := api.New()

	// catch kill signals for graceful shutdown
	graceful.AddSignal(syscall.SIGINT, syscall.SIGTERM)
	// start server
	log.Debugf("Server listening on port %s", config.Port)
	err := graceful.ListenAndServe(":"+config.Port, app)
	if err != nil {
		log.Error(err)
	}
	// wait until server gracefully exits
	graceful.Wait()
}
