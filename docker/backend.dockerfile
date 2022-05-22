############################
# STEP 1 build executable binary
############################

FROM golang:alpine AS builder

# Install git.
# Git is required for fetching the dependencies.
RUN apk update && apk add --no-cache git tzdata

# Create appuser.
ENV USER=appuser
ENV UID=10001 

# See https://stackoverflow.com/a/55757473/12429735RUN 
RUN adduser \    
    --disabled-password \    
    --gecos "" \    
    --home "/nonexistent" \    
    --shell "/sbin/nologin" \    
    --no-create-home \    
    --uid "${UID}" \    
    "${USER}"

WORKDIR $GOPATH/src/gestion-locative/backend
COPY ./backend .

RUN go mod download
RUN go mod verify

# optimize, remove debug info and remove cross compilation
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-w -s" -o /go/bin/backend
RUN COPY $GOPATH/src/gestion-locative/backend/.env /go/bin/.env

############################
# STEP 2 build a small image
############################
FROM scratch

# Import from builder
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Copy our static executable.
COPY --from=builder /go/bin/backend /backend
COPY --from=builder /go/bin/.env /.env

# Use an unprivileged user.
USER appuser:appuser

EXPOSE 1234

ENTRYPOINT [ "/backend" ]