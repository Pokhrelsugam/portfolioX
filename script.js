// Sticky Navigation Menu 
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");

// Show/hide sticky navigation and scroll button based on scroll position
window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
    scrollBtn.style.display = "block";
  } else {
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }
};

// Side Navigation Menu
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");

// Open side navigation
menuBtn.onclick = function () {
  navBar.classList.add("active");
  menuBtn.style.opacity = "0";
  menuBtn.style.pointerEvents = "none";
  body.style.overflow = "hidden";
  scrollBtn.style.pointerEvents = "none";
};

const hideNavMenu = () => {
  navBar.classList.remove("active");
  menuBtn.style.opacity = "1";
  menuBtn.style.pointerEvents = "auto";
  body.style.overflow = "auto";
  scrollBtn.style.pointerEvents = "auto";
};

// Close side navigation when cancel button clicked
cancelBtn.onclick = hideNavMenu;

// Close side navigation when a menu link is clicked
let navLinks = document.querySelectorAll(".menu li a");
navLinks.forEach((link) => {
  link.addEventListener("click", hideNavMenu);
});

// Dynamic Blog Snippet - Fetch RSS feed and render blogs
document.addEventListener("DOMContentLoaded", () => {
  const feedUrl = "https://ritible.com/profile/sugam/feed/gn";
  const proxyUrl = "https://api.codetabs.com/v1/proxy/?quest=" + encodeURIComponent(feedUrl);
  const blogContainer = document.getElementById("blog-container");

  fetch(proxyUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then(data => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      const items = xmlDoc.querySelectorAll("item");

      if (items.length === 0) {
        blogContainer.innerHTML = "<p>No blog entries found.</p>";
        return;
      }

      const limitedItems = Array.from(items).slice(0, 6);

      limitedItems.forEach((item) => {
        const title = item.querySelector("title")?.textContent || "No Title";
        const description = item.querySelector("description")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "#";
        const pubDate = item.querySelector("pubDate")?.textContent || "";

        // Try to extract first image safely
        let imgSrc = "";
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        const imgTag = tempDiv.querySelector('img');
        if (imgTag) {
          imgSrc = imgTag.getAttribute('src');
        }

        // fallback placeholder image
        imgSrc = imgSrc || 'https://ritible.com/wp-content/uploads/2024/12/Ritible-Launch.jpg';

        const box = document.createElement("div");
        box.classList.add("box");

        box.innerHTML = `
          <div class="thumbnail"><img src="${imgSrc}" alt="Blog Image"></div>
          <div class="content">
            <div class="topic"><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></div>
            ${pubDate ? `<div class="date">${new Date(pubDate).toLocaleDateString() }</div>` : ''}
          </div>
        `;

        blogContainer.appendChild(box);
      });
    })
    .catch(error => {
      console.error("Error fetching the RSS feed:", error);
      blogContainer.innerHTML = "<p>Unable to load blog entries at this time.</p>";
    });
});
