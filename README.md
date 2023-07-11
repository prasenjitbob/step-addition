# step-addition

# Git
  Clone the repo in your local using "git clone https://github.com/prasenjitbob/step-addition.git" command.

# Frontend
1. Navigate to the frontend directory: cd client
2. Install dependencies: npm install
3. Start the development server: npm run dev
4. Open your browser and visit http://localhost:3000 to access the blog frontend.

# Backend
1. Navigate to the backend directory: cd server
2. Install dependencies: npm install
3. Start the backend server: npm start
4. The backend server will run on http://localhost:5000.

# Database
1. Ensure that PostgreSQL is installed and running on your machine.
2. Create a new PostgreSQL database with the desired name (e.g., steps_db).

# Next steps
1. Copy your postgres credentials like db_name, username and password.
2. Paste those credentials in .env file which is there in server directory (check example.env for reference).
3. Login to PG CLI and create a table in the db using the below command or check "createTable.txt" file for the code: 
    CREATE TABLE step_results (
        id SERIAL PRIMARY KEY,
        num1 INTEGER NOT NULL,
        num2 INTEGER NOT NULL,
        steps JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )

# Congratulations now you can use the application.

# To access all the results you can use "localhost:5000/api/results" endpoint in postman or any other tools.
