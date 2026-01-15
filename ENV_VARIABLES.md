# Environment Variables Reference

## For Combined Deployment on Render

Copy and paste these EXACTLY as shown:

### Variable 1: NODE_ENV
```
Key:   NODE_ENV
Value: production
```

### Variable 2: JWT_SECRET
```
Key:   JWT_SECRET
Value: your-super-secret-jwt-key-change-this-minimum-32-characters
```
**Note:** Generate a random string at https://randomkeygen.com/

### Variable 3: DATABASE_PATH
```
Key:   DATABASE_PATH
Value: ./database/todolist.db
```

### Variable 4: PORT
```
Key:   PORT
Value: 10000
```

## Important Rules

✅ **DO:**
- Use only letters, numbers, underscore (_), hyphen (-), or dot (.)
- Copy exactly as shown above
- No quotes around values
- No spaces in the Key field

❌ **DON'T:**
- Add spaces around the `=` sign
- Use quotes `"` or `'` around values
- Add special characters like `@`, `#`, `$`, etc.
- Start key names with numbers

## How to Add on Render

1. Go to your Web Service settings
2. Click **"Environment"** tab in left sidebar
3. Click **"Add Environment Variable"** button
4. Enter Key in first box
5. Enter Value in second box
6. Click checkmark or press Enter
7. Repeat for all 4 variables
8. Service will auto-redeploy

## Example Screenshot Layout

```
┌────────────────────────────────────────────────────────┐
│ Environment Variables                  [Add Variable]   │
├────────────────────────────────────────────────────────┤
│                                                         │
│  NODE_ENV                                              │
│  ┌─────────────────────────────────────────────────┐  │
│  │ production                                       │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  JWT_SECRET                                            │
│  ┌─────────────────────────────────────────────────┐  │
│  │ your-super-secret-key-here                      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  DATABASE_PATH                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │ ./database/todolist.db                          │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  PORT                                                  │
│  ┌─────────────────────────────────────────────────┐  │
│  │ 10000                                           │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└────────────────────────────────────────────────────────┘
```

## Verification

After adding all variables, you should see:
- 4 environment variables listed
- Green checkmarks or "Saved" indicators
- Service will automatically redeploy

## Testing

After deployment completes:
1. Visit your app URL
2. Check logs for "✓ Server running on port 10000"
3. Test the app - login, create todos, view database

## Troubleshooting

**Error: "Environment variable keys must consist of..."**
- Check for typos in Key names
- Remove any spaces
- Copy directly from this file

**App won't start:**
- Check logs on Render dashboard
- Verify all 4 variables are set
- Make sure JWT_SECRET is at least 32 characters

**Database errors:**
- Verify DATABASE_PATH is exactly: `./database/todolist.db`
- Check logs for permission errors
