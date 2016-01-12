# Suggested Fields

```javascript
{
    "Lat": latitude,
    "Lon": longitude,
    "Time": time
    "Type": ?
    "Status": ?
    "Units": ?
    "Amount": dollar amount?
    "Description": ?
}
```

# Suggested Parsed Format

```javascript
{
    "location": {
        "lat": double,
        "lon": double,
    },
    "timestamp": string, // (UTC ISO 8601)
    "type": string,
    "status": string,
    "units": integer,
    "amount": integer, // (CENTS)
    "description": string
}
```
