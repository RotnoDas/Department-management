# Semester 6 - Class Schedule & Attendance

## 📚 Courses (Semester 6)

| Course Code | Course Name | Room | Time Slot |
|------------|-------------|------|-----------|
| CSE601 | Software Engineering | Room 401 | 08:00 - 09:30 |
| CSE602 | Computer Networks | Room 402 | 09:45 - 11:15 |
| CSE603 | Operating Systems | Room 403 | 11:30 - 13:00 |
| CSE604 | Web Technologies | Lab 201 | 14:00 - 15:30 |
| CSE605 | Machine Learning | Room 404 | 15:45 - 17:15 |

## ✅ Attendance System

### How It Works:

1. **Student Login** → Navigate to "Attendance" page
2. **Enable Location** → Browser will request GPS permission
3. **View Active Classes** → Shows classes happening right now
4. **Mark Attendance** → Click button to mark attendance

### Validation Rules:

- ✅ **Time Validation**: Can only mark during class time (start to end time)
- ✅ **Location Validation**: Must be within 100 meters of class location
- ✅ **One-time Mark**: Can only mark once per session
- ✅ **Status**: Marked as "Present" if on time, "Late" if after start time

### Location Coordinates:

All classes are at: **23.8103°N, 90.4125°E** (Dhaka, Bangladesh)
- Radius: 100 meters

### Testing the System:

1. **Sign up as a student** with semester 6
2. **Admin approves** the student
3. **Student logs in** and goes to Attendance page
4. **Enable location** when browser prompts
5. **Mark attendance** for active classes

### Attendance Statistics:

Students can view:
- Total sessions per course
- Attended sessions
- Present count
- Late count
- Attendance percentage

### Time Slots:

- **Morning Session**: 08:00 - 13:00 (3 classes)
- **Afternoon Session**: 14:00 - 17:15 (2 classes)

## 🔄 Daily Schedule

The system automatically creates attendance sessions for today's date. Sessions are marked as "active" during their time slot.

## 📊 Attendance Tracking

- **Present**: Marked on time (before or at start time)
- **Late**: Marked after start time but before end time
- **Absent**: Not marked during class time

## 🎯 Attendance Percentage

- **75%+**: Good (Green)
- **60-74%**: Warning (Yellow)
- **Below 60%**: Critical (Red)

## 💡 Tips for Students:

1. Enable location services before class starts
2. Mark attendance as soon as class begins
3. Be within 100m of the classroom
4. Check your attendance statistics regularly
5. Aim for at least 75% attendance

## 🔧 For Administrators:

To add more sessions or modify schedule:
1. Edit `server/database/seed.js`
2. Add courses to the `courses` array
3. Add session times to `sessionTimes` array
4. Run `npm run seed` to update database
