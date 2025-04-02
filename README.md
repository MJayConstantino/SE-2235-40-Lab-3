### Running Backend Tests

1. **Change to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a test environment file (.env.test):**  
   In the `/backend` folder, create a file named `.env.test` with the following contents. You can obtain your **DATABASE_URL** and **DIRECT_URL** from Supabase Connect (ORMs):
   ```dotenv
   NODE_ENV=test
   DATABASE_URL=""
   DIRECT_URL=""
   ```

4. **Pull the database schema from Supabase:**
   ```bash
   npx prisma db pull
   ```

5. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

6. **Run the tests:**
   ```bash
   npm run test
   ```