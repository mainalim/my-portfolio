document.addEventListener('DOMContentLoaded', function(){
  // focus first input for accessibility
  const first = document.querySelector('input[autofocus],input');
  if(first) first.focus();

  // smooth scrolling for nav links
  document.querySelectorAll('.nav-link').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').replace('#','');
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });

  // load projects into projectsGrid with images and modal
  const grid = document.getElementById('projectsGrid');
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const defaultProjects = [
    {
      title: 'Derma Doctor Assistant (Major Project, 2019)',
      description: 'A mobile based application that classifies the skin diseases and makes patients aware about the possible cases.',
      technologies: 'Mobile, Image Classification, ML',
      image: '/assets/derma.svg'
    },
    {
      title: 'Automated Floral Identification (Minor Project, 2018)',
      description: 'Predicts the plant leaf species using image processing and a neural network.',
      technologies: 'Image Processing, Neural Networks',
      image: '/assets/floral.svg'
    },
    {
      title: 'Auto Object Tracker (LOCUS-2018 Exhibition)',
      description: 'A bot that tracks a predefined object by capturing images and processing them.',
      technologies: 'Computer Vision, Robotics',
      image: '/assets/object-tracker.svg'
    },
    {
      title: 'LED Mirror (LOCUS-2017 Exhibition)',
      description: "Shadow-forming large LED frame that reacts to incoming light and creates artistic effects.",
      technologies: 'Electronics, Embedded Systems',
      image: '/assets/led-mirror.svg'
    },
    {
      title: 'Audio Amplifier (Semester project, 2017)',
      description: 'An audio amplifier designed for mobile phone audio output.',
      technologies: 'Analog Electronics',
      image: '/assets/audio-amplifier.svg'
    },
    {
      title: 'Word out of Picture (Semester project, C++)',
      description: 'A game that shows a picture and jumbled letters to guess the related word.',
      technologies: 'C++, Game Logic',
      image: '/assets/word-out-of-picture.svg'
    }
  ];

  if(grid){
    fetch('/api/projects')
      .then(res=>res.json())
      .then(projects=>{
        // If the API returns empty, use the default projects provided inline
        if(!projects || !projects.length){ projects = defaultProjects; }
        grid.innerHTML = projects.map((p,i)=>`
          <article class="card reveal" tabindex="0" aria-label="View details for ${p.title}" data-index="${i}">
            <img src="${p.image || '/assets/project-placeholder.png'}" alt="${p.title} project image" />
            <h4>${p.title}</h4>
            <p>${p.description || ''}</p>
            <div class="tags">${p.technologies || ''}</div>
            <p>${p.repoLink?`<a href="${p.repoLink}" target="_blank">Repo</a>`:''}${p.demoLink?` | <a href="${p.demoLink}" target="_blank">Demo</a>`:''}</p>
          </article>
        `).join('');
        // reveal animation
        setTimeout(()=>{
          document.querySelectorAll('.reveal').forEach((el,j)=>{
            setTimeout(()=>el.classList.add('visible'),j*120);
          });
        },200);
        // modal popup
        grid.querySelectorAll('.card').forEach((card,idx)=>{
          card.addEventListener('click',()=>{
            const p = projects[idx];
            modalBody.innerHTML = `
              <h2>${p.title}</h2>
              <img src="${p.image || '/assets/project-placeholder.png'}" alt="${p.title}" style="max-width:100%;border-radius:10px;margin-bottom:1rem;" />
              <p>${p.description || ''}</p>
              <div class="tags">${p.technologies || ''}</div>
              <p>${p.repoLink?`<a href="${p.repoLink}" target="_blank">Repo</a>`:''}${p.demoLink?` | <a href="${p.demoLink}" target="_blank">Demo</a>`:''}</p>
            `;
            modal.classList.add('show');
            modal.setAttribute('aria-hidden','false');
          });
        });
      })
      .catch(err=>{ console.error('Failed to load projects', err); grid.innerHTML = '<p>Error loading projects.</p>'; });
  }
  // modal close
  if(modal){
    modal.querySelector('.modal-close').addEventListener('click',()=>{
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden','true');
    });
    modal.addEventListener('click',e=>{
      if(e.target===modal){
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden','true');
      }
    });
  }

  // scrollspy for nav
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = Array.from(navLinks).map(a=>document.getElementById(a.getAttribute('href').replace('#',''))).filter(Boolean);
  window.addEventListener('scroll',()=>{
    let active = 0;
    const scrollY = window.scrollY+120;
    sections.forEach((sec,i)=>{
      if(sec.offsetTop<=scrollY) active=i;
    });
    navLinks.forEach((a,i)=>a.classList.toggle('active',i===active));
    document.querySelector('.site-header').classList.toggle('scrolled',window.scrollY>40);
  });

  // reveal timeline items when in viewport using IntersectionObserver
  const timelineItems = document.querySelectorAll('.timeline .reveal');
  if(timelineItems && 'IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },{threshold:0.15});
    timelineItems.forEach(t=>obs.observe(t));
  } else {
    // fallback: show them all
    timelineItems.forEach(t=>t.classList.add('visible'));
  }

  // contact section removed — no client-side contact handler

  // mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  if(navToggle){
    navToggle.addEventListener('click', ()=>{
      const isOpen = document.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', isOpen? 'true':'false');
    });

    // close nav when clicking a link
    document.querySelectorAll('.main-nav a').forEach(a=> a.addEventListener('click', ()=>{
      if(document.body.classList.contains('nav-open')){
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded','false');
      }
    }));
  }
});
