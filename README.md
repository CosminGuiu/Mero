A simple calendar domain API for managing events.

## **Installation**

```bash 
npm install mero-calendar-api
```

## **Usage**

```how to use:
import { Calendar } from 'mero-calendar-api';

const calendar = new Calendar();
calendar.createEvent({ title: 'Mero event', start: '2021-01-01T10:00:00Z', end: '2021-01-01T11:00:00Z' });