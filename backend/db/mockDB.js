import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "mockdb.json");

// Initialize mock database file
const initDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2));
  }
};

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { users: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

initDB();

export default {
  User: {
    findOne: async (query) => {
      const db = readDB();
      if (query.email) {
        return db.users.find((u) => u.email === query.email) || null;
      }
      return null;
    },

    create: async (userData) => {
      const db = readDB();
      const newUser = {
        _id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
      };
      db.users.push(newUser);
      writeDB(db);
      return newUser;
    },

    find: async () => {
      const db = readDB();
      return db.users;
    },
  },
};
