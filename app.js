/* Ticketmaster front-end clone
   Home and Watchlist use the supplied screenshots as full-screen artwork.
   The four bottom tabs are live and route to Home, Watchlist, My Tickets and Account. */

(() => {
  "use strict";

  const view = document.getElementById("view");
  const tabbar = document.getElementById("tabbar");
  const toastEl = document.getElementById("toast");
  const modalRoot = document.getElementById("modalRoot");
  const floatingLayer = document.getElementById("floatingLayer");

  /* ------------------------------ data ------------------------------ */

  const EVENTS = {
    semis1: {
      id: "semis1",
      title: "WORLDS 2026 - SEMIS 1",
      dateLong: "Saturday, November 7, 2026",
      dateShort: "Sat, Nov 7",
      dateCompact: "SAT • NOV 7, 2026 • 4:00 PM",
      dateDetail: "SAT • NOV 7, 2026 • 16:00",
      navTitle: "Worlds 2026 - Semis 1",
      time: "4:00 PM",
      venue: "Credit Union of Texas Event Center",
      city: "Allen, TX",
      image: "assets/img/lol.jpg",
      badge: "Upcoming",
      accent: "#1f6fff",
    },
    semis2: {
      id: "semis2",
      title: "WORLDS 2026 - SEMIS 2",
      dateLong: "Sunday, November 8, 2026",
      dateShort: "Sun, Nov 8",
      dateCompact: "SUN • NOV 8, 2026 • 4:00 PM",
      dateDetail: "SUN • NOV 8, 2026 • 16:00",
      navTitle: "Worlds 2026 - Semis 2",
      time: "4:00 PM",
      venue: "Credit Union of Texas Event Center",
      city: "Allen, TX",
      image: "assets/img/lol.jpg",
      badge: "Upcoming",
      accent: "#1f6fff",
    },
    worlds2025: {
      id: "worlds2025",
      title: "WORLDS 2025 - FINAL",
      dateLong: "Saturday, November 8, 2025",
      dateShort: "Sat, Nov 8",
      dateCompact: "SAT • NOV 8, 2025 • 2:00 PM",
      dateDetail: "SAT • NOV 8, 2025 • 14:00",
      navTitle: "Worlds 2025 - Final",
      time: "2:00 PM",
      venue: "Barclays Center",
      city: "Brooklyn, NY",
      image: "assets/img/lol.jpg",
      badge: "Past",
      accent: "#5f6670",
    },
    blippi2025: {
      id: "blippi2025",
      title: "BLIPPI LIVE!",
      dateLong: "Saturday, January 25, 2025",
      dateShort: "Sat, Jan 25",
      dateCompact: "SAT • JAN 25, 2025 • 2:00 PM",
      dateDetail: "SAT • JAN 25, 2025 • 14:00",
      navTitle: "Blippi Live!",
      time: "2:00 PM",
      venue: "Comerica Center",
      city: "Frisco, TX",
      image: "assets/img/blippi.jpg",
      badge: "Past",
      accent: "#f59e0b",
    },
  };

  const TICKETS = [
    {
      id: "TM-8472-2607",
      event: "semis1",
      section: "111",
      row: "B",
      seatNumbers: ["1", "2"],
      quantity: 2,
      order: "30000743742399429",
      future: true,
    },
    {
      id: "TM-8472-2608",
      event: "semis2",
      section: "111",
      row: "B",
      seatNumbers: ["3", "4"],
      quantity: 2,
      order: "30000743742399430",
      future: true,
    },
    {
      id: "TM-2025-1108",
      event: "worlds2025",
      section: "112",
      row: "C",
      seatNumbers: ["11", "12"],
      quantity: 2,
      order: "30000732211877005",
      future: false,
    },
    {
      id: "TM-2025-0125",
      event: "blippi2025",
      section: "102",
      row: "C",
      seatNumbers: ["4", "5"],
      quantity: 2,
      order: "30000711882291504",
      future: false,
    },
  ];

  const ACCOUNT_MENU = [
    {
      label: "Account",
      items: [
        { icon: "user", label: "Personal info", value: "Jordan Reyes" },
        { icon: "card", label: "Payment methods", value: "Visa •••• 2048" },
        { icon: "bell", label: "Notifications", value: "On" },
        { icon: "lock", label: "Privacy & security" },
      ],
    },
    {
      label: "Activity",
      items: [
        { icon: "receipt", label: "Order history", value: "8 orders" },
        { icon: "transfer", label: "Ticket transfers" },
      ],
    },
    {
      label: "Support",
      items: [
        { icon: "help", label: "Help & support" },
        { icon: "settings", label: "App settings" },
      ],
    },
  ];

  const state = {
    ticketsView: "upcoming",
    detailTab: "tickets",
    deferredInstallPrompt: null,
  };

  let detailScrollHandler = null;

  /* ------------------------------ icons ------------------------------ */

  const ICONS = {
    bookmark: '<path d="M6.6 4.3h10.8v15.2l-5.4-3.7-5.4 3.7z"/>',
    heart: '<path d="M20.7 8.7c0 4.6-8.7 10.2-8.7 10.2S3.3 13.3 3.3 8.7a4.7 4.7 0 0 1 8.8-2.5 4.7 4.7 0 0 1 8.6 2.5Z"/>',
    ticket: '<path d="M4.2 8.7V6.8c0-1.1.9-2 2-2h11.6c1.1 0 2 .9 2 2v1.9a3.4 3.4 0 0 0 0 6.6v1.9c0 1.1-.9 2-2 2H6.2c-1.1 0-2-.9-2-2v-1.9a3.4 3.4 0 0 0 0-6.6Z"/><path d="M8 9.2v5.6M12.4 9.4h4.2"/>',
    ticketFilled: '<path d="M4.5 6.6c0-1 .8-1.8 1.8-1.8h11.4c1 0 1.8.8 1.8 1.8v2.1a3.4 3.4 0 0 0 0 6.6v2.1c0 1-.8 1.8-1.8 1.8H6.3c-1 0-1.8-.8-1.8-1.8v-2.1a3.4 3.4 0 0 0 0-6.6Z" fill="currentColor" stroke="none"/><path d="M8.3 9.2v5.6M12.2 9.4h4.2M12.2 12.5h3.2" stroke="#0b0b0b" stroke-width="1.6"/>',
    calendarPlus: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.3"/><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17M17.5 13v6M14.5 16h6"/>',
    user: '<circle cx="12" cy="8" r="3.4"/><path d="M5.4 20c.7-3.5 3-5.4 6.6-5.4s5.9 1.9 6.6 5.4"/>',
    qr: '<rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.8v2.8h-2.8zM20.5 14.5v6M14.5 20.5h6"/>',
    install: '<rect x="6" y="2.8" width="12" height="18.4" rx="2.5"/><path d="M10.5 5.5h3M12 9v6m0 0 2.4-2.4M12 15l-2.4-2.4"/>',
    spark: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    lock: '<rect x="5" y="10" width="14" height="10" rx="2.2"/><path d="M8.2 10V7.4a3.8 3.8 0 0 1 7.6 0V10"/><path d="M12 14v2.4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.3"/><path d="M7.5 3v4M16.5 3v4M3.5 9.5h17"/>',
    chevron: '<path d="m9 5.5 6.4 6.5L9 18.5"/>',
    back: '<path d="M19 12H5m0 0 6-6M5 12l6 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.4 4.4L19 7.2"/>',
    card: '<rect x="3" y="5.4" width="18" height="13.2" rx="2.5"/><path d="M3 9.8h18M6.5 15h3"/>',
    receipt: '<path d="M6 3.2h12v17.6l-3-1.8-3 1.8-3-1.8-3 1.8z"/><path d="M9 7.5h6M9 11h6M9 14.5h4"/>',
    transfer: '<path d="M4 8.5h13m0 0-3.4-3.4M17 8.5l-3.4 3.4M20 15.5H7m0 0 3.4-3.4M7 15.5l3.4 3.4"/>',
    help: '<circle cx="12" cy="12" r="8.8"/><path d="M9.7 9.2a2.4 2.4 0 1 1 3.4 2.2c-.8.4-1.1 1-1.1 1.8v.4"/><path d="M12 17.1h.01"/>',
    settings: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.9v2.2M12 18.9v2.2M21.1 12h-2.2M5.1 12H2.9M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6"/>',
    bell: '<path d="M18.2 9.8c0-3.4-1.7-5.5-4.5-6V2.8h-3.4v1c-2.8.5-4.5 2.6-4.5 6 0 5-2 6.3-2 6.3h16.4s-2-1.3-2-6.3Z"/><path d="M9.4 19.6a2.7 2.7 0 0 0 5.2 0"/>',
    external: '<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>',
    download: '<path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5"/><path d="M4 20.5h16"/>',
    barcode: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/><path d="M8 8v8M11 8v8M14 8v8M17 8v8"/>',
    dots: '<circle cx="12" cy="5.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.1" fill="currentColor" stroke="none"/>',
    arrowUp: '<path d="M12 20V4m0 0-5.5 5.5M12 4l5.5 5.5"/>',
    arrowUpRight: '<path d="M6 18 18 6M8 6h10v10"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.8-4.6L4 4v6h6M4 13a8 8 0 0 0 14.8 4.6L20 20v-6h-6"/>',
  };

  function icon(name, className = "") {
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
  }

  /* ------------------------------ helpers ------------------------------ */

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[character]));
  }

  function routeName() {
    const raw = location.hash.replace(/^#\/?/, "").split("?")[0];
    return raw || "home";
  }

  function isStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches
      || window.navigator.standalone === true
      || /TicketmasterAndroid/.test(navigator.userAgent);
  }

  let toastTimer = null;
  function showToast(message, iconName = "check") {
    clearTimeout(toastTimer);
    toastEl.innerHTML = `${icon(iconName)}<span>${escapeHtml(message)}</span>`;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  /* ------------------------------ QR artwork ------------------------------ */

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let value = seed || 1;
    return () => {
      value ^= value << 13;
      value ^= value >>> 17;
      value ^= value << 5;
      return (value >>> 0) / 4294967296;
    };
  }

  function qrSvg(seed) {
    const modules = 25;
    const quiet = 2;
    const total = modules + quiet * 2;
    const random = seededRandom(hashString(seed));
    const cells = Array.from({ length: modules }, () => Array(modules).fill(false));
    const reserved = Array.from({ length: modules }, () => Array(modules).fill(false));

    function reserve(x, y, width, height) {
      for (let row = y; row < y + height; row += 1) {
        for (let column = x; column < x + width; column += 1) {
          if (row >= 0 && row < modules && column >= 0 && column < modules) {
            reserved[row][column] = true;
          }
        }
      }
    }

    function finder(x, y) {
      reserve(x - 1, y - 1, 9, 9);
      for (let row = 0; row < 7; row += 1) {
        for (let column = 0; column < 7; column += 1) {
          const outer = row === 0 || row === 6 || column === 0 || column === 6;
          const center = row >= 2 && row <= 4 && column >= 2 && column <= 4;
          cells[y + row][x + column] = outer || center;
        }
      }
    }

    finder(0, 0);
    finder(modules - 7, 0);
    finder(0, modules - 7);

    // A small alignment square keeps the pattern reading as a QR code.
    const alignX = modules - 9;
    const alignY = modules - 9;
    reserve(alignX - 1, alignY - 1, 7, 7);
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 5; column += 1) {
        const outer = row === 0 || row === 4 || column === 0 || column === 4;
        const center = row === 2 && column === 2;
        cells[alignY + row][alignX + column] = outer || center;
      }
    }

    for (let index = 8; index < modules - 8; index += 1) {
      cells[6][index] = index % 2 === 0;
      cells[index][6] = index % 2 === 0;
      reserved[6][index] = true;
      reserved[index][6] = true;
    }

    for (let row = 0; row < modules; row += 1) {
      for (let column = 0; column < modules; column += 1) {
        if (!reserved[row][column]) {
          cells[row][column] = random() > 0.53;
        }
      }
    }

    let rectangles = "";
    for (let row = 0; row < modules; row += 1) {
      for (let column = 0; column < modules; column += 1) {
        if (cells[row][column]) {
          rectangles += `<rect x="${column + quiet}" y="${row + quiet}" width="1" height="1"/>`;
        }
      }
    }

    return `<svg viewBox="0 0 ${total} ${total}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true"><rect width="${total}" height="${total}" fill="#fff"/><g fill="#0b0b0b">${rectangles}</g></svg>`;
  }

  /* ------------------------------ tab bar ------------------------------ */

  const TABS = [
    { id: "home", label: "Home", href: "#/home" },
    { id: "watchlist", label: "Watchlist", href: "#/watchlist" },
    { id: "tickets", label: "My Tickets", href: "#/tickets" },
    { id: "account", label: "Account", href: "#/account" },
  ];

  function tabIcon(tabId, isActive = false) {
    if (tabId === "home") {
      return '<span class="tmark" aria-hidden="true"></span>';
    }
    if (tabId === "tickets" && isActive) {
      return icon("ticketFilled", "tab-svg");
    }
    const iconNames = { watchlist: "bookmark", tickets: "ticket", account: "user" };
    return icon(iconNames[tabId] || tabId, "tab-svg");
  }

  function renderTabbar(active, ghost = false) {
    tabbar.className = `tabbar${ghost ? " ghost" : ""}`;
    tabbar.innerHTML = TABS.map((tab) => {
      const isActive = tab.id === active;
      return `<a class="tab${isActive ? " active" : ""}${ghost ? " ghosted" : ""}" href="${tab.href}" data-tab="${tab.id}" aria-label="${tab.label}"${isActive ? ' aria-current="page"' : ""}>
        <span class="tab-icon">${tabIcon(tab.id, isActive)}</span>
        <span class="tab-label">${tab.label}</span>
      </a>`;
    }).join("");
  }

  /* ------------------------------ screens ------------------------------ */

  function renderImageScreen(kind) {
    const screens = {
      home: {
        src: "assets/screens/home.jpg",
        alt: "Ticketmaster home screen with the location Plano, Texas, US, event search, For You event cards, trending artists and recently browsed events.",
        title: "Ticketmaster — Live Events",
      },
      watchlist: {
        src: "assets/screens/watchlist.jpg",
        alt: "Ticketmaster watchlist screen with Events and Favorites tabs and recently browsed League of Legends events.",
        title: "Watchlist — Ticketmaster",
      },
    };
    const screen = screens[kind];
    view.className = "view no-scroll";
    view.innerHTML = `<section class="screen-page">
      <img src="${screen.src}" alt="${escapeHtml(screen.alt)}" draggable="false" fetchpriority="high">
    </section>`;
    renderTabbar(kind, true);
    document.title = screen.title;
    window.scrollTo(0, 0);
  }

  function titleMarkup(title) {
    return escapeHtml(title).replace(" - ", " -<br>");
  }

  function usFlagSvg() {
    let stripes = "";
    const stripeHeight = 24 / 13;
    for (let index = 0; index < 13; index += 1) {
      if (index % 2 === 0) {
        stripes += `<rect x="0" y="${(index * stripeHeight).toFixed(2)}" width="24" height="${stripeHeight.toFixed(2)}" fill="#b22234"/>`;
      }
    }
    let stars = "";
    for (let row = 0; row < 3; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        stars += `<circle cx="${2.4 + column * 2.1}" cy="${2.2 + row * 2.25}" r=".42" fill="#fff"/>`;
      }
    }
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="us-flag-clip"><circle cx="12" cy="12" r="12"/></clipPath></defs><g clip-path="url(#us-flag-clip)"><rect width="24" height="24" fill="#fff"/>${stripes}<rect width="10.2" height="10" fill="#1f3c78"/>${stars}</g></svg>`;
  }

  function renderTickets() {
    renderTabbar("tickets", false);
    const past = state.ticketsView === "past";
    const upcomingTickets = TICKETS.filter((ticket) => ticket.future);
    const pastTickets = TICKETS.filter((ticket) => !ticket.future);
    const tickets = past ? pastTickets : upcomingTickets;

    const ticketMarkup = tickets.map((ticket) => {
      const event = EVENTS[ticket.event];
      return `<article class="event-ticket">
        <div class="event-ticket-hero">
          <img src="${event.image}" alt="${escapeHtml(event.title)}" loading="lazy">
          <span class="event-ticket-date">${event.dateCompact}</span>
        </div>
        <div class="event-ticket-info">
          <h2>${titleMarkup(event.title)}</h2>
          <span class="event-ticket-rule" aria-hidden="true"></span>
          <p class="event-ticket-venue">${escapeHtml(event.venue)} - ${escapeHtml(event.city)}</p>
        </div>
        <button class="view-tickets" type="button" data-view-ticket="${ticket.id}">
          ${past ? "View Order" : "View Tickets"} ${icon("external")}
        </button>
      </article>`;
    }).join("");

    view.className = "view";
    view.innerHTML = `<section class="ticket-page">
      <header class="ticket-page-head">
        <div class="ticket-page-title-row">
          <span class="ticket-head-spacer" aria-hidden="true"></span>
          <h1 class="ticket-page-title">My Tickets <span class="flag-badge" role="img" aria-label="United States">${usFlagSvg()}</span></h1>
          <button class="ticket-help" type="button" data-ticket-help>Help</button>
        </div>
        <div class="ticket-tabs" role="tablist" aria-label="Ticket period">
          <button class="ticket-tab${past ? "" : " active"}" type="button" role="tab" aria-selected="${!past}" data-ticket-view="upcoming">
            Upcoming (${upcomingTickets.length})
          </button>
          <button class="ticket-tab${past ? " active" : ""}" type="button" role="tab" aria-selected="${past}" data-ticket-view="past">
            Past (${pastTickets.length})
          </button>
        </div>
      </header>

      <div class="ticket-page-body">
        <div class="ticket-list-heading">
          <h2>${past ? "Past Events" : "Enjoy Your Event"}</h2>
          <button class="calendar-add" type="button" data-ticket-calendar aria-label="Add event to calendar">${icon("calendarPlus")}</button>
        </div>
        <div class="event-ticket-list">${ticketMarkup}</div>
        <p class="ticket-page-note">${icon("lock")} Your tickets are protected. Screenshots cannot be used for entry.</p>
      </div>
    </section>`;

    view.scrollTop = 0;
    document.title = "My Tickets — Ticketmaster";
    bindTickets();
  }

  function bindTickets() {
    view.querySelectorAll("[data-ticket-view]").forEach((button) => {
      button.addEventListener("click", () => {
        if (state.ticketsView !== button.dataset.ticketView) {
          state.ticketsView = button.dataset.ticketView;
          renderTickets();
        }
      });
    });

    view.querySelectorAll("[data-view-ticket]").forEach((button) => {
      button.addEventListener("click", () => {
        location.hash = `#/ticket/${encodeURIComponent(button.dataset.viewTicket)}`;
      });
    });

    view.querySelector("[data-ticket-help]")?.addEventListener("click", openTicketHelp);

    view.querySelector("[data-ticket-calendar]")?.addEventListener("click", () => {
      showToast("Event added to your calendar", "calendar");
    });
  }

  function openTicketHelp() {
    openSheet({
      title: "Ticket help",
      subtitle: "Everything you need for entry",
      body: `<div class="install-steps">
        <div class="install-step"><span class="step-number">${icon("qr")}</span><p><strong>Have your QR code ready</strong><br>Open View Tickets and turn up your screen brightness at the gate.</p></div>
        <div class="install-step"><span class="step-number">${icon("transfer")}</span><p><strong>Need to send tickets?</strong><br>Use the transfer option in your Ticketmaster account before the event.</p></div>
        <div class="install-step"><span class="step-number">${icon("help")}</span><p><strong>Still need help?</strong><br>support@ticketmaster.example · Available 24/7</p></div>
      </div>
      <p class="sheet-note">This is a front-end demo. The links above are illustrative.</p>`,
    });
  }

  function detailTabsMarkup(activeTab) {
    return `<div class="detail-tabs" role="tablist" aria-label="Event details">
      <button class="detail-tab${activeTab === "tickets" ? " active" : ""}" type="button" role="tab" aria-selected="${activeTab === "tickets"}" data-detail-tab="tickets">Tickets</button>
      <button class="detail-tab${activeTab === "extras" ? " active" : ""}" type="button" role="tab" aria-selected="${activeTab === "extras"}" data-detail-tab="extras">Extras</button>
    </div>`;
  }

  function detailPanelMarkup(ticket, activeTab) {
    const event = EVENTS[ticket.event];

    if (activeTab === "extras") {
      return `<div class="detail-panel" id="detailPanel">
        <div class="extras-heading">
          <p class="eyebrow">Enhance your night</p>
          <h2>Make it a night</h2>
          <p>Add parking, merch and more to your event.</p>
        </div>
        <div class="extras-list">
          <button class="extra-row" type="button" data-extra="Parking">
            <span class="extra-icon">${icon("card")}</span>
            <span><strong>Prepaid parking</strong><small>Reserve a spot near the venue · from $25</small></span>
            ${icon("chevron", "extra-chevron")}
          </button>
          <button class="extra-row" type="button" data-extra="Merch">
            <span class="extra-icon">${icon("spark")}</span>
            <span><strong>Official event merch</strong><small>Skip the line with express pickup · from $35</small></span>
            ${icon("chevron", "extra-chevron")}
          </button>
          <button class="extra-row" type="button" data-extra="VIP">
            <span class="extra-icon">${icon("ticket")}</span>
            <span><strong>VIP upgrades</strong><small>Check availability for premium seats</small></span>
            ${icon("chevron", "extra-chevron")}
          </button>
        </div>
        <p class="detail-note">Add-ons are subject to availability.</p>
      </div>`;
    }

    const seatCards = ticket.seatNumbers.map((seat) => `<section class="verified-ticket">
      <div class="verified-title">Verified Resale Ticket</div>
      <div class="verified-grid">
        <div><span>SECTION</span><strong>${escapeHtml(ticket.section)}</strong></div>
        <div><span>ROW</span><strong>${escapeHtml(ticket.row)}</strong></div>
        <div><span>SEAT</span><strong>${escapeHtml(seat)}</strong></div>
      </div>
    </section>`).join("");

    const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue}, ${event.city}`)}`;

    return `<div class="detail-panel" id="detailPanel">
      <div class="order-summary">
        <div>
          <h2>Order #${escapeHtml(ticket.order)}</h2>
          <p>x${ticket.quantity} Tickets</p>
        </div>
        <button class="order-more" type="button" data-order-menu aria-label="Order options">${icon("dots")}</button>
      </div>
      <div class="verified-list">${seatCards}</div>
      <div class="detail-map-card">
        <img src="assets/img/venue-map.jpg" alt="Map showing the area around ${escapeHtml(event.venue)}">
      </div>
      <a class="detail-directions" href="${directions}" rel="noopener">Get Directions</a>
      <p class="detail-note">${icon("lock")} Your tickets are protected. Screenshots cannot be used for entry.</p>
    </div>`;
  }

  function floatingActionsMarkup() {
    return `<div class="ticket-action-pill" role="group" aria-label="Ticket actions">
      <button class="ticket-action" type="button" disabled>
        <span class="ticket-action-icon">${icon("arrowUp")}</span>
        <span>Upgrade</span>
      </button>
      <span class="action-divider" aria-hidden="true"></span>
      <button class="ticket-action" type="button" data-detail-action="transfer">
        <span class="ticket-action-icon">${icon("arrowUpRight")}</span>
        <span>Transfer</span>
      </button>
      <span class="action-divider" aria-hidden="true"></span>
      <button class="ticket-action" type="button" data-detail-action="sell">
        <span class="ticket-action-icon">${icon("refresh")}</span>
        <span>Sell</span>
      </button>
    </div>`;
  }

  function renderTicketDetail(ticketId) {
    const ticket = TICKETS.find((item) => item.id === ticketId);
    if (!ticket) {
      location.replace("#/tickets");
      return;
    }

    state.detailTab = "tickets";
    const event = EVENTS[ticket.event];

    tabbar.className = "tabbar hidden";
    tabbar.innerHTML = "";
    floatingLayer.innerHTML = floatingActionsMarkup();
    view.className = "view";
    view.innerHTML = `<section class="ticket-detail-page">
      <header class="detail-topbar" data-detail-topbar>
        <button class="detail-back" type="button" data-detail-back aria-label="Back to My Tickets">${icon("back")}</button>
        <div class="detail-topbar-copy">
          <strong>${escapeHtml(event.navTitle)}</strong>
          <span>${escapeHtml(event.venue)}, ${escapeHtml(event.city)}</span>
        </div>
        <button class="detail-help" type="button" data-detail-help>Help</button>
        <button class="detail-qr" type="button" data-detail-qr aria-label="Show ticket QR code">${icon("barcode")}</button>
      </header>

      <div class="detail-hero">
        <img src="${event.image}" alt="${escapeHtml(event.title)}">
      </div>

      <section class="detail-event">
        <span class="detail-date">${event.dateDetail}</span>
        <h1>${escapeHtml(event.title)}</h1>
        <div class="detail-venue-row">
          <p>${escapeHtml(event.venue)}, ${escapeHtml(event.city)}</p>
          <span class="ticket-count">${icon("ticket")} x${ticket.quantity}</span>
        </div>
        <button class="detail-view-tickets" type="button" data-detail-view>${icon("barcode")} View Tickets</button>
      </section>

      ${detailTabsMarkup("tickets")}
      ${detailPanelMarkup(ticket, "tickets")}
    </section>`;

    view.scrollTop = 0;
    document.title = `${event.navTitle} — Ticketmaster`;
    bindTicketDetail(ticket);
  }

  function bindTicketDetail(ticket) {
    const event = EVENTS[ticket.event];
    const topbar = view.querySelector("[data-detail-topbar]");
    const onScroll = () => {
      if (!topbar) return;
      topbar.classList.toggle("scrolled", view.scrollTop > 24);
    };
    detailScrollHandler = onScroll;
    view.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    view.querySelector("[data-detail-back]")?.addEventListener("click", () => {
      location.hash = "#/tickets";
    });

    view.querySelector("[data-detail-help]")?.addEventListener("click", openTicketHelp);

    view.querySelectorAll("[data-detail-view], [data-detail-qr]").forEach((button) => {
      button.addEventListener("click", () => openTicket(ticket.id));
    });

    view.querySelectorAll("[data-detail-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.detailTab;
        if (state.detailTab === tab) return;
        state.detailTab = tab;
        view.querySelectorAll("[data-detail-tab]").forEach((tabButton) => {
          const active = tabButton.dataset.detailTab === tab;
          tabButton.classList.toggle("active", active);
          tabButton.setAttribute("aria-selected", String(active));
        });
        const scrollTop = view.scrollTop;
        const panel = view.querySelector("#detailPanel");
        if (panel) panel.outerHTML = detailPanelMarkup(ticket, tab);
        bindDetailPanel(ticket);
        view.scrollTop = scrollTop;
      });
    });

    bindDetailPanel(ticket);

    const transferButton = floatingLayer.querySelector('[data-detail-action="transfer"]');
    const sellButton = floatingLayer.querySelector('[data-detail-action="sell"]');
    transferButton?.addEventListener("click", () => openTransferSheet(ticket, event));
    sellButton?.addEventListener("click", () => openSellSheet(ticket, event));
  }

  function bindDetailPanel(ticket) {
    const event = EVENTS[ticket.event];
    view.querySelector("[data-order-menu]")?.addEventListener("click", () => {
      openSheet({
        title: "Order options",
        subtitle: `Order #${ticket.order}`,
        body: `<div class="detail-sheet-actions">
          <button class="sheet-action" type="button" data-order-action="view">${icon("barcode")} <span>View tickets</span></button>
          <button class="sheet-action" type="button" data-order-action="transfer">${icon("transfer")} <span>Transfer tickets</span></button>
          <button class="sheet-action" type="button" data-order-action="sell">${icon("refresh")} <span>Sell tickets</span></button>
          <button class="sheet-action" type="button" data-order-action="help">${icon("help")} <span>Get help with this order</span></button>
        </div>`,
      });

      modalRoot.querySelector('[data-order-action="view"]')?.addEventListener("click", () => {
        closeSheet();
        setTimeout(() => openTicket(ticket.id), 300);
      });
      modalRoot.querySelector('[data-order-action="transfer"]')?.addEventListener("click", () => {
        closeSheet();
        setTimeout(() => openTransferSheet(ticket, event), 300);
      });
      modalRoot.querySelector('[data-order-action="sell"]')?.addEventListener("click", () => {
        closeSheet();
        setTimeout(() => openSellSheet(ticket, event), 300);
      });
      modalRoot.querySelector('[data-order-action="help"]')?.addEventListener("click", () => {
        closeSheet();
        setTimeout(openTicketHelp, 300);
      });
    });

    view.querySelectorAll("[data-extra]").forEach((button) => {
      button.addEventListener("click", () => {
        showToast(`${button.dataset.extra} add-ons are not available in this demo`, "spark");
      });
    });
  }

  function openTransferSheet(ticket, event) {
    openSheet({
      title: "Transfer tickets",
      subtitle: `${event.navTitle} · x${ticket.quantity}`,
      body: `<p class="sheet-copy">Send your tickets to a friend. They will get an email with a secure link to accept them.</p>
        <label class="field-label" for="transfer-email">Recipient email</label>
        <input class="text-field" id="transfer-email" type="email" inputmode="email" placeholder="friend@example.com" autocomplete="email">
        <button class="btn btn-primary btn-wide" type="button" data-transfer-submit>${icon("transfer")} Send transfer link</button>
        <p class="sheet-note">Transfers are disabled in this front-end demo.</p>`,
    });
    modalRoot.querySelector("[data-transfer-submit]")?.addEventListener("click", () => {
      const email = modalRoot.querySelector("#transfer-email")?.value?.trim();
      closeSheet();
      showToast(email ? `Transfer link sent to ${email}` : "Enter a recipient email first", "check");
    });
  }

  function openSellSheet(ticket, event) {
    openSheet({
      title: "Sell tickets",
      subtitle: `${event.navTitle} · x${ticket.quantity}`,
      body: `<p class="sheet-copy">List your verified resale tickets and get paid when they sell. You can change or remove your listing at any time.</p>
        <div class="resale-preview">
          <span>Suggested listing price</span>
          <strong>$186 <small>each</small></strong>
        </div>
        <button class="btn btn-primary btn-wide" type="button" data-sell-submit>${icon("refresh")} List tickets for resale</button>
        <p class="sheet-note">Resale is not connected in this front-end demo.</p>`,
    });
    modalRoot.querySelector("[data-sell-submit]")?.addEventListener("click", () => {
      closeSheet();
      showToast("Resale is unavailable in this demo", "refresh");
    });
  }

  function openTicket(ticketId) {
    const ticket = TICKETS.find((item) => item.id === ticketId);
    if (!ticket) return;
    const event = EVENTS[ticket.event];

    openSheet({
      title: "Your tickets",
      subtitle: "Scan this code at the entrance",
      body: `<div class="qr-sheet">
        <div class="qr-frame">${qrSvg(ticket.id)}</div>
        <h3 class="ticket-modal-title">${escapeHtml(event.title)}</h3>
        <p class="ticket-modal-meta">${event.dateLong} · ${event.time}<br>${escapeHtml(event.venue)} · ${escapeHtml(event.city)}</p>
        <div class="seat-strip">
          <div><span>Section</span><strong>${ticket.section}</strong></div>
          <div><span>Row</span><strong>${ticket.row}</strong></div>
          <div><span>Seat</span><strong>${ticket.seatNumbers.join(" & ")}</strong></div>
        </div>
        <button class="btn btn-secondary btn-wide" type="button" data-wallet>${icon("install")} Add to Google Wallet</button>
        <p class="sheet-note">Order #${escapeHtml(ticket.order)} · x${ticket.quantity} mobile tickets<br>Demo artwork — this is not a valid ticket.</p>
      </div>`,
    });

    modalRoot.querySelector("[data-wallet]")?.addEventListener("click", () => {
      showToast("Google Wallet is not connected in this demo", "install");
    });
  }

  function renderAccount() {
    renderTabbar("account", false);
    const installed = isStandalone();

    const menuMarkup = ACCOUNT_MENU.map((group) => `<p class="group-label">${group.label}</p>
      <div class="menu-card">
        ${group.items.map((item) => `<button class="menu-row" type="button" data-menu="${escapeHtml(item.label)}">
          <span class="menu-icon">${icon(item.icon)}</span>
          <span class="menu-label">${escapeHtml(item.label)}</span>
          ${item.value ? `<span class="menu-value">${escapeHtml(item.value)}</span>` : ""}
          ${icon("chevron", "menu-chevron")}
        </button>`).join("")}
      </div>`).join("");

    view.className = "view";
    view.innerHTML = `<section class="page">
      <header class="page-head">
        <p class="eyebrow">Your profile</p>
        <h1 class="page-title">Account</h1>
        <p class="page-subtitle">Good to see you again</p>
      </header>

      <div class="profile-card">
        <div class="avatar" aria-hidden="true">JR</div>
        <div class="profile-copy">
          <h2>Jordan Reyes</h2>
          <p>jordan.reyes@example.com</p>
          <span class="member-chip">${icon("spark")} Member since 2021</span>
        </div>
      </div>

      <div class="stats" aria-label="Account summary">
        <div class="stat"><strong>${TICKETS.filter((ticket) => ticket.future).length}</strong><span>Tickets</span></div>
        <div class="stat"><strong>2</strong><span>Favorites</span></div>
        <div class="stat"><strong>12</strong><span>Events</span></div>
      </div>

      <div class="install-card">
        <span class="install-icon">${icon(installed ? "check" : "install")}</span>
        <div class="install-copy">
          <h3>${installed ? "You’re using the app" : "Get the Ticketmaster app"}</h3>
          <p>${installed ? "Installed and ready for showtime." : "Install on your Android home screen for full-screen access."}</p>
        </div>
        ${installed ? "" : `<button class="btn btn-blue" type="button" data-install>Install</button>`}
      </div>

      ${menuMarkup}

      <button class="btn btn-secondary signout" type="button" data-signout>Sign out</button>

      <footer class="account-footer">
        <p class="brandline">Ticketmaster · Fan experience</p>
        <p>Front-end demo · v1.0.0</p>
      </footer>
    </section>`;

    view.scrollTop = 0;
    document.title = "Account — Ticketmaster";
    bindAccount();
  }

  function bindAccount() {
    view.querySelector("[data-install]")?.addEventListener("click", installApp);
    view.querySelector("[data-signout]")?.addEventListener("click", () => {
      showToast("You’re still signed in — this is a demo", "user");
    });

    view.querySelectorAll("[data-menu]").forEach((button) => {
      button.addEventListener("click", () => {
        const label = button.dataset.menu;
        if (label === "Help & support") {
          openSheet({
            title: "Help & support",
            subtitle: "We’re here to help",
            body: `<div class="install-steps">
              <div class="install-step"><span class="step-number">${icon("help")}</span><p><strong>Visit the help center</strong><br>Browse answers about tickets, transfers and entry.</p></div>
              <div class="install-step"><span class="step-number">${icon("card")}</span><p><strong>Order support</strong><br>Have your order number ready when you contact us.</p></div>
              <div class="install-step"><span class="step-number">${icon("user")}</span><p><strong>Contact us</strong><br>support@ticketmaster.example · Available 24/7</p></div>
            </div>
            <p class="sheet-note">This is a front-end demo. The links above are illustrative.</p>`,
          });
        } else if (label === "Order history") {
          openSheet({
            title: "Order history",
            subtitle: "Your recent orders",
            body: `<div class="ticket-stack">
              ${TICKETS.map((ticket) => {
                const event = EVENTS[ticket.event];
                return `<div class="install-step"><span class="step-number">${icon("ticket")}</span><p><strong>${escapeHtml(event.title)}</strong><br>${event.dateShort} · ${escapeHtml(event.city)}<br><span style="color:#8e8e8e">${escapeHtml(ticket.order)}</span></p></div>`;
              }).join("")}
            </div>`,
          });
        } else if (label === "Payment methods") {
          openSheet({
            title: "Payment methods",
            subtitle: "Demo payment profile",
            body: `<div class="install-step"><span class="step-number">${icon("card")}</span><p><strong>Visa ending in 2048</strong><br>Expires 09/29 · Default payment method</p></div>
              <p class="sheet-note">No payment details are stored by this demo.</p>`,
          });
        } else {
          showToast(`${label} is a demo screen`, "spark");
        }
      });
    });
  }

  /* ------------------------------ install / PWA ------------------------------ */

  async function installApp() {
    if (isStandalone()) {
      showToast("You’re already using the installed app", "check");
      return;
    }

    if (state.deferredInstallPrompt) {
      const prompt = state.deferredInstallPrompt;
      state.deferredInstallPrompt = null;
      prompt.prompt();
      try {
        await prompt.userChoice;
      } catch (error) {
        // The prompt can be dismissed; nothing else to do.
      }
      return;
    }

    openSheet({
      title: "Get the app",
      subtitle: "Full-screen event access on Android",
      body: `<ol class="install-steps">
        <li class="install-step"><span class="step-number">1</span><p>Open this page in <strong>Chrome on Android</strong>.</p></li>
        <li class="install-step"><span class="step-number">2</span><p>Tap the <strong>⋮ menu</strong>, then choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p></li>
        <li class="install-step"><span class="step-number">3</span><p>Launch it from your home screen — it opens full-screen like a native app.</p></li>
      </ol>
      <a class="btn btn-secondary btn-wide" href="download/Ticketmaster.apk" download>${icon("download")} Download Android APK</a>
      <p class="sheet-note">Ticketmaster is a Progressive Web App, so it also works offline after the first load.<br>The APK is a small Android WebView wrapper around this same interface.</p>`,
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
  });

  window.addEventListener("appinstalled", () => {
    state.deferredInstallPrompt = null;
    showToast("Ticketmaster installed", "check");
    if (routeName() === "account") renderAccount();
  });

  /* ------------------------------ modal ------------------------------ */

  let lastFocused = null;
  let closeTimer = null;

  function openSheet({ title, subtitle = "", body = "" }) {
    clearTimeout(closeTimer);
    lastFocused = document.activeElement;

    modalRoot.innerHTML = `<button class="modal-backdrop" type="button" data-close-sheet aria-label="Close dialog"></button>
      <section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <div class="sheet-grabber" aria-hidden="true"></div>
        <div class="sheet-head">
          <div>
            <h2 id="sheet-title">${escapeHtml(title)}</h2>
            ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
          </div>
          <button class="icon-button" type="button" data-close-sheet aria-label="Close">${icon("close")}</button>
        </div>
        <div class="sheet-content">${body}</div>
      </section>`;

    modalRoot.classList.add("open");
    requestAnimationFrame(() => {
      modalRoot.querySelector(".icon-button")?.focus({ preventScroll: true });
    });
    document.addEventListener("keydown", modalKeydown);
  }

  function closeSheet() {
    modalRoot.classList.remove("open");
    document.removeEventListener("keydown", modalKeydown);
    closeTimer = setTimeout(() => {
      if (!modalRoot.classList.contains("open")) {
        modalRoot.innerHTML = "";
      }
    }, 380);
    if (lastFocused instanceof HTMLElement) {
      lastFocused.focus({ preventScroll: true });
    }
  }

  function modalKeydown(event) {
    if (event.key === "Escape") {
      closeSheet();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...modalRoot.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.disabled && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  modalRoot.addEventListener("click", (event) => {
    if (event.target.closest("[data-close-sheet]")) {
      closeSheet();
    }
  });

  /* ------------------------------ router ------------------------------ */

  function clearDetailRoute() {
    if (detailScrollHandler) {
      view.removeEventListener("scroll", detailScrollHandler);
      detailScrollHandler = null;
    }
    floatingLayer.innerHTML = "";
    tabbar.classList.remove("hidden");
  }

  function render() {
    clearDetailRoute();
    const route = routeName();

    if (route.startsWith("ticket/")) {
      renderTicketDetail(decodeURIComponent(route.slice("ticket/".length)));
      return;
    }

    if (route === "watchlist") {
      renderImageScreen("watchlist");
    } else if (route === "tickets") {
      renderTickets();
    } else if (route === "account") {
      renderAccount();
    } else {
      renderImageScreen("home");
    }
  }

  window.addEventListener("hashchange", () => {
    closeSheet();
    render();
  });

  if (!location.hash) {
    history.replaceState(null, "", "#/home");
  }

  render();

  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        // Service workers are a progressive enhancement.
      });
    });
  }
})();
