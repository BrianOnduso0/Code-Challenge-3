// Your code here

document.addEventListener('DOMContentLoaded', () => {
    const baseUrl = 'http://localhost:3000';
    
    const fetchFilms = async () => {
      try {
        const response = await fetch(`${baseUrl}/films`)
        if (!response.ok) {
          throw new Error('Failed to fetch films')
        }
        const films = await response.json()
        displayFilmList(films)
        displayFilmDetails(films[0])
      } catch (error) {
        console.error(error.message)
      }
    }
    
    const displayFilmList = (films) => {
      const filmsList = document.getElementById('films');
      filmsList.innerHTML = ''
      films.forEach((film) => {
        const filmItem = document.createElement('li')
        filmItem.className = 'film item'
        filmItem.textContent = film.title
        filmItem.dataset.filmId = film.id
        
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.className = 'delete-button ui button'
        deleteButton.addEventListener('click', (event) => {
          event.stopPropagation()
          deleteFilm(film.id)
        });
        
        filmItem.appendChild(deleteButton)
        
        filmItem.addEventListener('click', () => {
          fetchFilmDetails(film.id)
        })
        filmsList.appendChild(filmItem)
      })
    }
    
    const fetchFilmDetails = async (filmId) => {
      try {
        const response = await fetch(`${baseUrl}/films/${filmId}`);
        if (!response.ok) {
          throw new Error('System has Failed to fetch film details')
        }
        const filmDetails = await response.json()
        displayFilmDetails(filmDetails)
      } catch (error) {
        console.error(error.message)
      }
    }
    
    const displayFilmDetails = (film) => {
      const poster = document.getElementById('poster')
      const title = document.getElementById('title')
      const runtime = document.getElementById('runtime')
      const description = document.getElementById('film-info')
      const showtime = document.getElementById('showtime')
      const ticketNum = document.getElementById('ticket-num')
      const buyTicketBtn = document.getElementById('buy-ticket')
      
      poster.src = film.poster
      poster.alt = film.title
      title.textContent = film.title
      runtime.textContent = `${film.runtime} minutes`
      description.textContent = film.description
      showtime.textContent = film.showtime
      ticketNum.textContent = film.capacity - film.tickets_sold
      
      if (film.tickets_sold >= film.capacity) {
        buyTicketBtn.textContent = 'Sold Out'
        buyTicketBtn.disabled = true
      } else {
        buyTicketBtn.textContent = 'Buy Ticket'
        buyTicketBtn.disabled = false
      }
      
      buyTicketBtn.addEventListener('click', () => {
        buyTicket(film)
      });
    };

    const buyTicket = async (film) => {
      try {
        const updatedTicketsSold = film.tickets_sold + 1
        const response = await fetch(`${baseUrl}/films/${film.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
        });
        if (!response.ok) {
          throw new Error('System has Failed to buy a ticket')
        }
        
        const ticketNum = document.getElementById('ticket-num')
        const remainingTickets = film.capacity - updatedTicketsSold
        ticketNum.textContent = remainingTickets
        
        const buyTicketBtn = document.getElementById('buy-ticket')
        if (remainingTickets === 0) {
          buyTicketBtn.textContent = 'Sold Out'
          buyTicketBtn.disabled = true;
        }
        
        await addTicketToDatabase(film.id)
      } catch (error) {
        console.error(error.message)
      }
    }
    
    const addTicketToDatabase = async (filmId) => {
      try {
        const response = await fetch(`${baseUrl}/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ film_id: filmId, number_of_tickets: 1 }),
        });
        if (!response.ok) {
          throw new Error('System has Failed to add a ticket into the database')
        }
      } catch (error) {
        console.error(error.message)
      }
    };
    
    const deleteFilm = async (filmId) => {
      try {
        const response = await fetch(`${baseUrl}/films/${filmId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('System has Failed to delete the film')
        }
        
        const filmItem = document.querySelector(`li[data-film-id="${filmId}"]`)
        filmItem.remove()
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchFilms()
  })
