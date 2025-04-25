# REST API v1 types

## Development

`CountEstimationView` can be nested by any view.  
`SimpleView` can nest other `SimpleView` if no cycle.  
`DetailView` can nest other `SimpleView`.  
`ResultView` cam nest other `DetailView` and `SimpleView`.
