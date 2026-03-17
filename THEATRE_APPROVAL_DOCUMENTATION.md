# Theatre Approval System Documentation

## Overview
This system allows customers to create theatres with a status of "PENDING", and only admins can approve or reject them. Once approved, theatres become active on the platform.

---

## API Endpoints

### 1. Create Theatre (Customer)
**Endpoint:** `POST /mba/api/v1/theatres`

**Authentication Required:** Yes (any authenticated user)

**Request Body:**
```json
{
  "name": "Cineworld Central Plaza",
  "description": "Spacious multiplex with latest blockbusters",
  "city": "Delhi",
  "pincode": 110001,
  "address": "Central Plaza, Connaught Place, New Delhi",
  "licenseNumber": "LICENCE123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully created the theatre",
  "statusCode": 201,
  "data": {
    "_id": "69a578dbe3d32ddb5b1944cf",
    "name": "Cineworld Central Plaza",
    "city": "Delhi",
    "status": "PENDING",
    "owner": "69a5624495f4a3242bbac4ba",
    "createdAt": "2026-03-02T11:47:39.000Z"
  }
}
```

**Notes:**
- Theatre is created with status "PENDING"
- Owner is automatically set to the authenticated user
- Confirmation email is sent to the owner

---

### 2. Approve/Reject Theatre (Admin Only)
**Endpoint:** `PATCH /mba/api/v1/theatres/:id/approve`

**Authentication Required:** Yes (Admin only)

**Request Body:**
```json
{
  "status": "APPROVED"  // or "REJECTED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Theatre approved successfully",
  "statusCode": 200,
  "data": {
    "_id": "69a578dbe3d32ddb5b1944cf",
    "name": "Cineworld Central Plaza",
    "status": "APPROVED",
    "owner": "69a5624495f4a3242bbac4ba"
  }
}
```

**Notes:**
- Only available to admins
- Sends approval/rejection email to theatre owner
- Updates theatre status to APPROVED or REJECTED

---

### 3. Get All Theatres
**Endpoint:** `GET /mba/api/v1/theatres`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `city` - Filter by city
- `name` - Filter by name (case-insensitive)
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "theatres": [
      {
        "_id": "69a578dbe3d32ddb5b1944cf",
        "name": "Cineworld Central Plaza",
        "city": "Delhi",
        "status": "APPROVED"
      }
    ],
    "pagination": {
      "totalItems": 50,
      "totalPages": 5,
      "currentPage": 1,
      "pageSize": 10
    }
  }
}
```

---

### 4. Get Single Theatre
**Endpoint:** `GET /mba/api/v1/theatres/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "69a578dbe3d32ddb5b1944cf",
    "name": "Cineworld Central Plaza",
    "status": "APPROVED",
    "city": "Delhi",
    "movies": [],
    "owner": "69a5624495f4a3242bbac4ba"
  }
}
```

---

## Theatre Statuses

| Status | Description | When Set |
|--------|-------------|----------|
| PENDING | Waiting for admin approval | When created by customer |
| APPROVED | Active and visible on platform | When admin approves |
| REJECTED | Not approved, inactive | When admin rejects |

---

## The Theatre Approval Workflow

```
1. Customer Creates Theatre
   ↓
   Theatre Status: PENDING
   Email Sent: Creation confirmation
   ↓
2. Admin Reviews Theatre
   ├─ Yes: Approve
   │  ↓
   │  Theatre Status: APPROVED
   │  Theatre visible to users
   │  Email Sent: Approval notification
   │
   └─ No: Reject
      ↓
      Theatre Status: REJECTED
      Email Sent: Rejection notification
```

---

## Using the Theatre Client

### Installation / Setup

```javascript
const TheatreClient = require('./src/clients/theatre.client');

// Initialize with admin token
const theatreClient = new TheatreClient(adminToken);
```

### Example: Get Pending Theatres and Approve

```javascript
// Get all pending theatres
const pending = await theatreClient.getPendingTheatres();

// Approve a theatre
await theatreClient.approveTheatre(theatreId);

// Reject a theatre
await theatreClient.rejectTheatre(theatreId);
```

### Complete Admin Workflow

```javascript
async function approveTheatres() {
  try {
    // 1. Get pending theatres
    const response = await theatreClient.getPendingTheatres();
    const theatres = response.data.theatres;

    // 2. Review and approve/reject each
    for (const theatre of theatres) {
      console.log(`Reviewing: ${theatre.name}`);
      
      if (theatre.licenseNumber && theatre.city) {
        // Approve if valid
        await theatreClient.approveTheatre(theatre._id);
        console.log('✓ Approved');
      } else {
        // Reject if invalid
        await theatreClient.rejectTheatre(theatre._id);
        console.log('✗ Rejected');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

---

## Theatre Client Methods

### Create Theatre
```javascript
const newTheatre = await theatreClient.createTheatre({
  name: 'My Theatre',
  city: 'Mumbai',
  pincode: 400001,
  address: 'Some address',
  licenseNumber: 'LIC123'
});
```

### Get Pending Theatres
```javascript
const response = await theatreClient.getPendingTheatres();
// Returns only PENDING status theatres
```

### Approve Theatre
```javascript
const approved = await theatreClient.approveTheatre(theatreId);
```

### Reject Theatre
```javascript
const rejected = await theatreClient.rejectTheatre(theatreId);
```

### Get Theatre Details
```javascript
const details = await theatreClient.getTheatreByID(theatreId);
```

### Update Theatre
```javascript
const updated = await theatreClient.updateTheatre(theatreId, {
  description: 'Updated description'
});
```

### Get All Theatres
```javascript
const response = await theatreClient.getAllTheatres({
  page: 1,
  limit: 10,
  city: 'Delhi',
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
```

### Add Movies to Theatre
```javascript
const updated = await theatreClient.addMoviesToTheatre(
  theatreId,
  ['movieId1', 'movieId2']
);
```

### Remove Movies from Theatre
```javascript
const updated = await theatreClient.removeMoviesFromTheatre(
  theatreId,
  ['movieId1']
);
```

---

## Error Handling

```javascript
try {
  await theatreClient.approveTheatre(theatreId);
} catch (error) {
  console.error('Status:', error.status);
  console.error('Message:', error.message);
  console.error('Details:', error.details);
}
```

Error responses include:
- `status` - HTTP status code
- `message` - Error message
- `details` - Additional validation details (if applicable)

---

## Middleware & Authorization

### Auth Middleware
- `isAuthenticated` - User must be logged in
- `isAdmin` - User must have ADMIN role
- `isAdminOrClient` - User must be ADMIN or CLIENT

### Theatre Creation
- Requires: `isAuthenticated`
- Any authenticated user can create a theatre

### Theatre Approval
- Requires: `isAuthenticated` AND `isAdmin`
- Only admins can approve/reject theatres

---

## Database Model

### Theatre Schema

```javascript
{
  name: String (required, min 5 chars),
  description: String,
  city: String (required),
  pincode: Number (required),
  address: String,
  movies: [ObjectId] (references Movie),
  owner: ObjectId (references User, required),
  licenseNumber: String (required),
  status: String (PENDING|APPROVED|REJECTED, default: PENDING),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing the API

### Create Theatre (as Customer)
```bash
curl -X POST http://localhost:5000/mba/api/v1/theatres \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Theatre",
    "city": "Delhi",
    "pincode": 110001,
    "address": "123 Main St",
    "licenseNumber": "LIC123"
  }'
```

### Approve Theatre (as Admin)
```bash
curl -X PATCH http://localhost:5000/mba/api/v1/theatres/THEATRE_ID/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{"status": "APPROVED"}'
```

### Get Pending Theatres (as Admin)
```bash
curl -X GET "http://localhost:5000/mba/api/v1/theatres?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Email Notifications

### Sent Events:
1. **Theatre Created** - Sent to owner (creation confirmation)
2. **Theatre Approved** - Sent to owner (approval notification)
3. **Theatre Rejected** - Sent to owner (rejection notification)

### Email Service Integration:
- Configured via `process.env.NOTI_SERVICE`
- Requires `email.service.js` with recipient email as array
- Includes subject and content

---

## Future Enhancements

- [ ] Add more validation checks before approval
- [ ] Require documents for theatre verification
- [ ] Add admin notes/comments on approval/rejection
- [ ] Add pagination for pending theatres
- [ ] Add bulk approval/rejection
- [ ] Add analytics for approval trends
- [ ] Add appeal process for rejected theatres

---

## Support

For issues or questions, refer to the error messages returned by the API. Ensure:
1. User is authenticated with valid JWT token
2. Admin has proper authorization for approval operations
3. Theatre ID is valid MongoDB ObjectId
4. Status value is either "APPROVED" or "REJECTED"
