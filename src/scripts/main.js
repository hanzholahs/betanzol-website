const supabaseUrl = 'https://dnkvpzncrkjookybqmla.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRua3Zwem5jcmtqb29reWJxbWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5MjA0MzIsImV4cCI6MjAyMzQ5NjQzMn0.NQaWWdKqsMnLkKgbXQkqJDqwfP3F8sdOJCQ5E7BjKf0'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

const dday = new Date('2024-03-02T11:00:00').getTime()
const tday = new Date().getTime()
var time_difference = dday - tday
var time_counter = 0

update_wishes()
render_audience()
render_countdown()
setInterval(render_countdown, 1000)

const rsvp_form = document.getElementById('rsvp-form')
rsvp_form.addEventListener("submit", (event) => {
    event.preventDefault()
    submit_form()
})

const rsvp_thank = document.getElementById('rsvp-thank-note')



function render_audience() {
    getParams = window.location.search

    if (getParams.length == 0) return
    
    audience = getParams.split('&')
        .map((s) => {return s.split('=')})
        .filter((s) => {return s[0].replace('?', '') == 'to'})

    if (audience) {
        audience = audience[0][1].replace(/[^a-zA-Z\d]/g, ' ')
    }

    if (audience.toLowerCase() == 'all') return

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
            if (row.wish == '') continue
            container.appendChild(create_wish_card(row))
        }
    }
}

function create_wish_card(row) {
    header = row.fullname
    date = row.created_at
    wish = row.wish

    date = new Date(date)
    date = date.getFullYear() + '-' +
           ('0' + date.getMonth()).slice(-2) + '-' +
           ('0' + date.getDate()).slice(-2)  + ' ' +
           ('0' + date.getHours()).slice(-2) + ':' +
           ('0' + date.getMinutes()).slice(-2)

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

async function submit_form() {
    fullname = document.getElementById('rsvp-fullname').value
    phone = 111 //document.getElementById('rsvp-phone').value
    confirmation = document.getElementById('rsvp-confirmation').value
    wish = document.getElementById('rsvp-wish').value

    row = {fullname: fullname, phone: phone, confirmation: confirmation, wish: wish}

    if (!fullname || !confirmation) {
        window.alert('Data untuk Nama dan Kehadiran tidak boleh kosong.')
        console.error('Form is not complete.')
        console.log(row)
        return
    }

    if (confirmation == "Tidak Hadir") { row.confirmation = 0 }
    else if (confirmation == "1 Orang") { row.confirmation = 1 }
    else if (confirmation == "2 Orang") { row.confirmation = 2 }
    else { row.confirmation = -1 }


    
    insert_data(row)
    rsvp_form.setAttribute('style', 'display: none;')
    rsvp_thank.setAttribute('style', 'display: block;')
}

async function insert_data(row) {
    console.log(row)

    const { data, error } = await supabaseClient
        .from('Wedding_Guest')
        .insert(row)

    if (error) {
        console.error('Could not insert the data.')
        console.log(error)
    }
}

function format_time(time) {
    d = Math.floor(time / (1000 * 60 * 60 * 24))
    h = Math.floor(time % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
    m = Math.floor(time % (1000 * 60 * 60) / (1000 * 60))
    s = Math.floor(time % (1000 * 60) / 1000)

    return  [d, h, m, s]
}

function render_countdown() {
    time_counter = time_counter + 1

    count = format_time(time_difference - time_counter * 1000)
    count = count.map((val) => val <= 9 ? '0' + val : val)

    el_d = document.getElementById('counter-d')
    el_d.innerHTML = count[0]
    el_h = document.getElementById('counter-h')
    el_h.innerHTML = count[1]
    el_m = document.getElementById('counter-m')
    el_m.innerHTML = count[2]
    el_s = document.getElementById('counter-s')
    el_s.innerHTML = count[3]
}

