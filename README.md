# remote-logger
A simple NodeJS remote logger using mux-demux pattern

A small program that starts a child process and redirects both its standard output and standard error to a remote server, which in turn, saves the two streams in two separate files.