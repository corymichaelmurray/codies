package main

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	metricRequest = promauto.NewCounterVec(prometheus.CounterOpts{
		Namespace: "codies",
		Subsystem: "codies",
		Name:      "request_total",
		Help:      "Total number of HTTP requests.",
	}, []string{"code", "method"})

	metricRequestPath = promauto.NewCounterVec(prometheus.CounterOpts{
		Namespace: "codies",
		Subsystem: "codies",
		Name:      "request_path_total",
		Help:      "HTTP requests by path",
	}, []string{"path"})
)
