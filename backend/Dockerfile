FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY NexaShowroom.Domain/NexaShowroom.Domain.csproj NexaShowroom.Domain/
COPY NexaShowroom.Application/NexaShowroom.Application.csproj NexaShowroom.Application/
COPY NexaShowroom.Infrastructure/NexaShowroom.Infrastructure.csproj NexaShowroom.Infrastructure/
COPY NexaShowroom.API/NexaShowroom.API.csproj NexaShowroom.API/

RUN dotnet restore NexaShowroom.API/NexaShowroom.API.csproj

COPY . .

RUN dotnet publish NexaShowroom.API/NexaShowroom.API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "NexaShowroom.API.dll"]