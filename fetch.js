fs = require("fs");
const https = require("https");
process = require("process");
require("dotenv").config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const USE_GITHUB_DATA = process.env.USE_GITHUB_DATA;
const MEDIUM_USERNAME = "andrew.cruz";

const ERR = {
  noUserName:
    "Github Username was found to be undefined. Please set all relevant environment variables.",
  requestFailed:
    "The request to GitHub didn't succeed. Check if GitHub token in your .env file is correct.",
  requestFailedMedium:
    "The request to Medium didn't succeed. Check if Medium username in your .env file is correct."
};
if (USE_GITHUB_DATA === "true") {
  if (GITHUB_USERNAME === undefined) {
    throw new Error(ERR.noUserName);
  }

  console.log(`Fetching profile data for ${GITHUB_USERNAME}`);
  var data = JSON.stringify({
    query: `
{
  user(login: "${GITHUB_USERNAME}") {
    name
    bio
    avatarUrl
    location
    pinnedItems(first: 6, types: [REPOSITORY]) {
      totalCount
      edges {
        node {
          ... on Repository {
            name
            description
            forkCount
            stargazers {
              totalCount
            }
            url
            id
            diskUsage
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
  viewer {
    login
    contributionsCollection {
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`
  });
  const default_options = {
    hostname: "api.github.com",
    path: "/graphql",
    port: 443,
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "Node"
    }
  };

  const req = https.request(default_options, res => {
    let data = "";

    console.log(`statusCode: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      throw new Error(ERR.requestFailed);
    }

    res.on("data", d => {
      data += d;
    });
    res.on("end", () => {
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (parseErr) {
        console.log("Failed to parse GitHub response", parseErr);
        return;
      }

      if (parsed.errors) {
        console.log("GitHub GraphQL errors:", JSON.stringify(parsed.errors, null, 2));
      }

      // Profile consumers expect { data: { user: ... } }
      const profilePayload = JSON.stringify({
        data: {user: parsed.data && parsed.data.user}
      });
      fs.writeFile("./public/profile.json", profilePayload, function (err) {
        if (err) return console.log(err);
        console.log("saved file to public/profile.json");
      });

      const viewer = parsed.data && parsed.data.viewer;
      if (viewer && viewer.login && viewer.login !== GITHUB_USERNAME) {
        console.log(
          `Warning: token belongs to "${viewer.login}", but GITHUB_USERNAME is "${GITHUB_USERNAME}". Contribution graph will reflect the token owner.`
        );
      }

      const collection = viewer && viewer.contributionsCollection;
      const calendar = collection && collection.contributionCalendar;
      const restricted = collection && collection.restrictedContributionsCount;

      if (restricted > 0) {
        console.log(
          `Note: ${restricted} private contributions are hidden from the calendar (restrictedContributionsCount).`
        );
        console.log(
          "Use a classic PAT with the `repo` scope (fine-grained tokens often cannot unlock private contribution days),"
        );
        console.log(
          "and ensure GitHub → Settings → Profile → “Include private contributions on my profile” is enabled."
        );
        console.log(
          "Warning: enabling that setting (and deploying this JSON) makes private contribution *days* publicly visible on your site."
        );
      }

      if (calendar) {
        const calendarJson = JSON.stringify(calendar);
        fs.writeFile("./public/contributions.json", calendarJson, function (err) {
          if (err) return console.log(err);
          console.log(
            `saved file to public/contributions.json (${calendar.totalContributions} contributions)`
          );
        });
        fs.writeFile("./src/data/contributions.json", calendarJson, function (err) {
          if (err) return console.log(err);
          console.log("saved file to src/data/contributions.json");
        });
      } else {
        console.log("No contribution calendar in GitHub response");
      }
    });
  });

  req.on("error", error => {
    throw error;
  });

  req.write(data);
  req.end();
}

if (MEDIUM_USERNAME !== undefined) {
  console.log(`Fetching Medium blogs data for ${MEDIUM_USERNAME}`);
  const options = {
    hostname: "api.rss2json.com",
    path: `/v1/api.json?rss_url=https://medium.com/feed/@${MEDIUM_USERNAME}`,
    port: 443,
    method: "GET"
  };

  const req = https.request(options, res => {
    let mediumData = "";

    console.log(`statusCode: ${res.statusCode}`);
    if (res.statusCode !== 200) {
      throw new Error(ERR.requestMediumFailed);
    }

    res.on("data", d => {
      mediumData += d;
    });
    res.on("end", () => {
      fs.writeFile("./public/blogs.json", mediumData, function (err) {
        if (err) return console.log(err);
        console.log("saved file to public/blogs.json");
      });

      try {
        const parsed = JSON.parse(mediumData);
        const items = (parsed.items || []).slice(0, 3).map(blog => {
          const html = blog.content || blog.description || "";
          const description = String(html)
            .split(/<\/p>/i)
            .map(part => part.split(/<p[^>]*>/i).pop())
            .filter(el => el && el.trim().length > 0)
            .map(el => el.replace(/<\/?[^>]+(>|$)/g, "").trim())
            .join(" ");
          const image =
            blog.thumbnail ||
            (blog.enclosure && blog.enclosure.link) ||
            ((html.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || null);
          return {
            url: blog.link,
            title: blog.title,
            description,
            image
          };
        });
        fs.writeFile(
          "./src/data/blogs.json",
          JSON.stringify({items}, null, 2),
          function (err) {
            if (err) return console.log(err);
            console.log("saved file to src/data/blogs.json");
          }
        );
      } catch (parseErr) {
        console.log("Failed to write src/data/blogs.json", parseErr);
      }
    });
  });

  req.on("error", error => {
    throw error;
  });

  req.end();
}
