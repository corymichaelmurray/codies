package server

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	metricRooms = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace: "codies",
		Subsystem: "codies",
		Name:      "rooms",
		Help:      "Total number of rooms.",
	})

	metricClients = promauto.NewGauge(prometheus.GaugeOpts{
		Namespace: "codies",
		Subsystem: "codies",
		Name:      "clients",
		Help:      "Total number of clients.",
	})

	metricReceived = promauto.NewCounter(prometheus.CounterOpts{
		Namespace: "codies",
		Subsystem: "codies",
		Name:      "received_total",
		Help:      "Total number of received messages.",
	})

	metricSent = promauto.NewCounter(prometheus.CounterOpts{
		Namespace: "codies",
		Subsystem: "codies",
		Name:      "sent_total",
		Help:      "Total number of sent messages.",
	})

	metricHandleErrors = promauto.NewCounter(prometheus.CounterOpts{
		Namespace: "codies",
		Subsystem: "codies",
		Name:      "handle_error_total",
		Help:      "Total number of handle errors.",
	})

	metricHandleDuration = promauto.NewHistogram(prometheus.HistogramOpts{
		Namespace: "codies",
		Subsystem: "codies",
		Name:      "handle_seconds",
		Help:      "Time spent in handler function.",
		Buckets:   []float64{.00025, .0005, .001, .0025, .005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10},
	})
)
