FROM golang:1.21.4-bookworm

WORKDIR /api

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build main.go

RUN chmod +x main

EXPOSE 8080

CMD go run ./scripts/create/database.go && go run ./scripts/migrations/models.go && go run ./scripts/seeders/user.go && ./main