const supabaseUrl = 'https://dnkvpzncrkjookybqmla.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRua3Zwem5jcmtqb29reWJxbWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5MjA0MzIsImV4cCI6MjAyMzQ5NjQzMn0.NQaWWdKqsMnLkKgbXQkqJDqwfP3F8sdOJCQ5E7BjKf0'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

update_wishes()
render_audience()

const form = document.getElementById('rsvp-form')
form.addEventListener("submit", (event) => {
    event.preventDefault()
    submit_form()
})

function render_audience() {
    getParams = window.location.search

    if (getParams.length == 0) return
    
    audience = getParams.split('&')
        .map((s) => {return s.split('=')})
        .filter((s) => {return s[0].replace('?', '') == 'to'})

    if (audience) {
        audience = audience[0][1].replace(/[^a-zA-Z\d]/g, ' ')
    }

    if (audience) {
        audience_tag = document.getElementById('audience')
        audience_tag.innerHTML = audience
    }
}

async function update_wishes() {    
    let { data: Wedding_Guest, error } = await supabaseClient
        .from('Wedding_Guest')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Could not fetch the data.')
        console.log(error)
    }

    if (Wedding_Guest) {
        container = document.getElementById('wishes-container')
        for (row of Wedding_Guest) {
            container.appendChild(create_wish_card(row))
        }
    }
}

function create_wish_card(row) {
    header = row.fullname
    date = row.created_at
    wish = row.wish

    date = new Date(date)
    date = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + '.' + date.getMinutes()

    card_header = document.createElement('h5')
    card_header.innerHTML = header
    card_header.setAttribute('class', 'wish-card-header')

    card_date = document.createElement('p')
    card_date.setAttribute('class', 'wish-card-date')
    card_date.innerHTML = date
    
    card_wish = document.createElement('p')
    card_wish.setAttribute('class', 'wish-card-content')
    card_wish.innerHTML= wish

    card_inner = document.createElement('div')
    card_inner.setAttribute('class', 'wish-card-inner')
    card_inner.appendChild(card_header)
    card_inner.appendChild(card_date)
    card_inner.appendChild(card_wish)

    card_outer = document.createElement('div')
    card_outer.setAttribute('class', 'wish-card-outer')
    card_outer.appendChild(card_inner)

    return card_outer
}

function submit_form() {
    fullname = document.getElementById('rsvp-fullname').value
    phone = document.getElementById('rsvp-phone').value
    confirmation = document.getElementById('rsvp-confirmation').value
    wish = document.getElementById('rsvp-wish').value

    if (!fullname || !phone || !confirmation || !wish) {
        console.error('Form is not complete.')
        console.log({fullname: fullname, phone: phone, confirmation: confirmation, wish: wish})
        return
    }

    if (confirmation == "Tidak Hadir") { confirmation = 0 }
    else if (confirmation == "1 Orang") { confirmation = 1 }
    else if (confirmation == "2 Orang") { confirmation = 2 }
    else { confirmation = -1 }
    
    row = {
        fullname: fullname,
        phone: phone,
        confirmation: confirmation,
        wish: wish
    }

    insert_data(row)
}

async function insert_data(row) {
    const { data, error } = await supabaseClient
        .from('Wedding_Guest')
        .insert(row)
        .select()

    if (error) {
        console.error('Could not insert the data.')
        console.log(error)
    }
}