const express = require("express");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();

const PORT =
  process.env.PORT || 3000;

const SECRET =
  process.env.JWT_SECRET ||
  "CHANGE_ME_BEFORE_PRODUCTION";


/* =========================
   DIRECTORIES
========================= */

const dataDir =
  path.join(__dirname, "data");

const uploadDir =
  path.join(
    __dirname,
    "public",
    "uploads"
  );

fs.mkdirSync(
  dataDir,
  { recursive: true }
);

fs.mkdirSync(
  uploadDir,
  { recursive: true }
);


/* =========================
   DATABASE
========================= */

const dbFile =
  path.join(
    dataDir,
    "db.json"
  );


if (!fs.existsSync(dbFile)) {

  fs.writeFileSync(
    dbFile,
    JSON.stringify(
      {
        users: [],
        models: [],
        purchases: []
      },
      null,
      2
    )
  );

}


const readDB = () => {

  try {

    return JSON.parse(
      fs.readFileSync(
        dbFile,
        "utf8"
      )
    );

  } catch {

    return {
      users: [],
      models: [],
      purchases: []
    };

  }

};


const writeDB = db => {

  fs.writeFileSync(
    dbFile,
    JSON.stringify(
      db,
      null,
      2
    )
  );

};


const makeId = () => {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );

};


/* =========================
   MULTER / UPLOADS
========================= */

const storage =
  multer.diskStorage({

    destination: (
      req,
      file,
      cb
    ) => {

      cb(
        null,
        uploadDir
      );

    },


    filename: (
      req,
      file,
      cb
    ) => {

      const safe =
        file.originalname.replace(
          /[^a-zA-Z0-9._-]/g,
          "_"
        );

      cb(
        null,
        makeId() +
        "-" +
        safe
      );

    }

  });


const upload =
  multer({

    storage,

    limits: {
      fileSize:
        100 *
        1024 *
        1024
    },


    fileFilter: (
      req,
      file,
      cb
    ) => {

      const ext =
        path
          .extname(
            file.originalname
          )
          .toLowerCase();


      const allowed = [

        ".stl",
        ".3mf",
        ".obj",
        ".zip",

        ".png",
        ".jpg",
        ".jpeg",
        ".webp"

      ];


      cb(
        null,
        allowed.includes(ext)
      );

    }

  });


/* =========================
   MIDDLEWARE
========================= */

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);


/* =========================
   AUTH
========================= */

function auth(
  req,
  res,
  next
) {

  const token =
    (
      req.headers.authorization ||
      ""
    ).replace(
      "Bearer ",
      ""
    );


  try {

    req.user =
      jwt.verify(
        token,
        SECRET
      );

    next();

  } catch {

    res
      .status(401)
      .json({
        error:
          "Authentication required."
      });

  }

}


/* =========================
   GET ALL MODELS
========================= */

app.get(
  "/api/models",
  (req, res) => {

    const db =
      readDB();


    const q =
      (
        req.query.q ||
        ""
      )
        .toLowerCase()
        .trim();


    const category =
      (
        req.query.category ||
        ""
      )
        .toLowerCase()
        .trim();


    let models =
      db.models.filter(
        model => {

          const searchable =
            `
              ${model.title}
              ${model.description}
              ${model.category}
              ${model.designerName}
            `.toLowerCase();


          return (

            (
              !q ||
              searchable.includes(q)
            )

            &&

            (
              !category ||
              String(
                model.category ||
                ""
              )
                .toLowerCase() ===
              category
            )

          );

        }
      );


    models.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    );


    res.json(
      models
    );

  }
);


/* =========================
   GET SINGLE MODEL
========================= */

app.get(
  "/api/models/:id",
  (req, res) => {

    const db =
      readDB();


    const model =
      db.models.find(
        m =>
          m.id ===
          req.params.id
      );


    if (!model) {

      return res
        .status(404)
        .json({
          error:
            "Model not found."
        });

    }


    res.json(
      model
    );

  }
);


/* =========================
   REGISTER
========================= */

app.post(
  "/api/register",
  async (req, res) => {

    const {
      name,
      email,
      password
    } = req.body;


    if (
      !name ||
      !email ||
      !password ||
      password.length < 6
    ) {

      return res
        .status(400)
        .json({
          error:
            "Name, email and password (6+ chars) are required."
        });

    }


    const db =
      readDB();


    const normalizedEmail =
      email
        .toLowerCase()
        .trim();


    if (
      db.users.some(
        u =>
          u.email ===
          normalizedEmail
      )
    ) {

      return res
        .status(409)
        .json({
          error:
            "Email already registered."
        });

    }


    const cleanName =
      name.trim();


    const user = {

      id:
        makeId(),

      name:
        cleanName,

      email:
        normalizedEmail,

      passwordHash:
        await bcrypt.hash(
          password,
          10
        ),

      role:
        "designer",


      /* PROFILE */
      profile: {

        username:
          cleanName
            .toLowerCase()
            .replace(
              /[^a-z0-9_-]/g,
              ""
            ),

        bio:
          "3D designer and creator.",

        avatarUrl:
          ""

      },


      createdAt:
        new Date()
          .toISOString()

    };


    db.users.push(
      user
    );


    writeDB(
      db
    );


    const token =
      jwt.sign(
        {
          id:
            user.id,

          name:
            user.name,

          role:
            user.role
        },

        SECRET,

        {
          expiresIn:
            "7d"
        }
      );


    res.json({

      token,

      user: {

        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role

      }

    });

  }
);


/* =========================
   LOGIN
========================= */

app.post(
  "/api/login",
  async (req, res) => {

    const {
      email,
      password
    } = req.body;


    const db =
      readDB();


    const normalizedEmail =
      String(
        email || ""
      )
        .toLowerCase()
        .trim();


    const user =
      db.users.find(
        u =>
          u.email ===
          normalizedEmail
      );


    if (
      !user ||
      !(
        await bcrypt.compare(
          password || "",
          user.passwordHash
        )
      )
    ) {

      return res
        .status(401)
        .json({
          error:
            "Invalid email or password."
        });

    }


    const token =
      jwt.sign(
        {
          id:
            user.id,

          name:
            user.name,

          role:
            user.role
        },

        SECRET,

        {
          expiresIn:
            "7d"
        }
      );


    res.json({

      token,

      user: {

        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role

      }

    });

  }
);


/* =========================
   CURRENT USER
========================= */

app.get(
  "/api/me",
  auth,
  (req, res) => {

    const db =
      readDB();


    const user =
      db.users.find(
        u =>
          u.id ===
          req.user.id
      );


    if (!user) {

      return res.json(
        null
      );

    }


    res.json({

      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      role:
        user.role,

      profile:
        user.profile || {}

    });

  }
);


/* =========================
   DESIGNER API
========================= */

app.get(
  "/api/designers/:username",
  (req, res) => {

    const db =
      readDB();


    const searchName =
      decodeURIComponent(
        String(
          req.params.username ||
          ""
        )
      )
        .toLowerCase()
        .trim();


    /* ========================
       FIND DESIGNER
    ======================== */

    const designer =
      db.users.find(
        user => {

          const profileUsername =
            String(
              user.profile?.username ||
              ""
            )
              .toLowerCase()
              .trim();


          const displayName =
            String(
              user.name ||
              ""
            )
              .toLowerCase()
              .trim();


          return (

            profileUsername ===
            searchName

            ||

            displayName ===
            searchName

          );

        }
      );


    if (!designer) {

      return res
        .status(404)
        .json({
          error:
            "Designer not found."
        });

    }


    /* ========================
       DESIGNER MODELS
    ======================== */

    const models =
      db.models.filter(
        model =>
          model.designerId ===
          designer.id
      );


    /* ========================
       DOWNLOAD COUNT
    ======================== */

    const downloads =
      db.purchases.filter(
        purchase => {

          return models.some(
            model =>
              model.id ===
              purchase.modelId
          );

        }
      ).length;


    /* ========================
       PROFILE
    ======================== */

    const profile =
      designer.profile || {

        username:
          designer.name
            .toLowerCase()
            .replace(
              /[^a-z0-9_-]/g,
              ""
            ),

        bio:
          "3D designer and creator.",

        avatarUrl:
          ""

      };


    /* ========================
       RESPONSE
    ======================== */

    res.json({

      id:
        designer.id,

      name:
        designer.name,

      profile:

        designer.profile
          ? designer.profile
          : profile,

      stats: {

        models:
          models.length,

        downloads:
          downloads

      },

      models:

        models.sort(
          (a, b) =>

            new Date(
              b.createdAt
            ) -

            new Date(
              a.createdAt
            )
        )

    });

  }
);


/* =========================
   UPLOAD MODEL
========================= */

app.post(
  "/api/models",
  auth,

  upload.fields([

    {
      name:
        "modelFile",

      maxCount:
        1
    },

    {
      name:
        "image",

      maxCount:
        1
    }

  ]),


  (req, res) => {

    if (
      !req.files?.modelFile?.[0]
    ) {

      return res
        .status(400)
        .json({
          error:
            "3D file is required."
        });

    }


    const db =
      readDB();


    const f =
      req.files
        .modelFile[0];


    const image =
      req.files
        .image?.[0];


    const price =
      Number(
        req.body.price || 0
      );


    const model = {

      id:
        makeId(),

      title:
        String(
          req.body.title ||
          "Untitled model"
        ).trim(),

      description:
        String(
          req.body.description ||
          ""
        ).trim(),

      category:
        String(
          req.body.category ||
          "Other"
        ).trim(),

      price:
        Number.isFinite(price)
          ? Math.max(
              0,
              price
            )
          : 0,

      designerId:
        req.user.id,

      designerName:
        req.user.name,

      fileUrl:
        "/uploads/" +
        f.filename,

      imageUrl:
        image
          ? "/uploads/" +
            image.filename
          : "",

      originalFileName:
        f.originalname,

      createdAt:
        new Date()
          .toISOString()

    };


    db.models.push(
      model
    );


    writeDB(
      db
    );


    res.json(
      model
    );

  }
);


/* =========================
   PURCHASE
========================= */

app.post(
  "/api/purchase/:id",
  auth,

  (req, res) => {

    const db =
      readDB();


    const model =
      db.models.find(
        m =>
          m.id ===
          req.params.id
      );


    if (!model) {

      return res
        .status(404)
        .json({
          error:
            "Model not found."
        });

    }


    /*
      DEMO ONLY

      This records a purchase
      without real payment.
    */


    const purchase = {

      id:
        makeId(),

      modelId:
        model.id,

      buyerId:
        req.user.id,

      price:
        model.price,

      createdAt:
        new Date()
          .toISOString()

    };


    db.purchases.push(
      purchase
    );


    writeDB(
      db
    );


    res.json({

      purchase,

      downloadUrl:
        model.fileUrl

    });

  }
);


/* =========================
   MAIN PAGE
========================= */

app.get(
  "*",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "public",
        "index.html"
      )
    );

  }
);


/* =========================
   START SERVER
========================= */

app.listen(
  PORT,
  () => {

    console.log(
      `Marketplace3D running on http://localhost:${PORT}`
    );

  }
);
