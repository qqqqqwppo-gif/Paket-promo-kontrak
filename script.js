// =========================
// DATA
// =========================

let pelanggan = JSON.parse(localStorage.getItem("pelanggan")) || [];

const tbody = document.getElementById("tbody");
const cari = document.getElementById("cari");
const nama = document.getElementById("nama");
const wa = document.getElementById("wa");
const alamat = document.getElementById("alamat");
const paket = document.getElementById("paket");
const harga = document.getElementById("harga");
const tanggalPasang = document.getElementById("tanggalPasang");

const simpan = document.getElementById("simpan");
const darkModeBtn = document.getElementById("darkModeBtn");

// =========================
// FORMAT TANGGAL
// =========================

function formatTanggal(tanggal){

    return tanggal.toLocaleDateString("id-ID",{
        day:"2-digit",
        month:"long",
        year:"numeric"
    });

}

// =========================
// HITUNG KONTRAK
// =========================

function hitungKontrak(tgl){

    let pasang = new Date(tgl);

    // Bayar pertama = +1 bulan
    let bayarPertama = new Date(pasang);
    bayarPertama.setMonth(bayarPertama.getMonth()+1);

    // Bebas kontrak = +6 bulan dari bayar pertama
    let bebasKontrak = new Date(bayarPertama);
    bebasKontrak.setMonth(bebasKontrak.getMonth()+6);

    let hariIni = new Date();

    let status = "";
    let bulanKontrak = 0;

    if(hariIni < bayarPertama){

        status="🟢 Masa Gratis";

    }else if(hariIni >= bebasKontrak){

        status="🔴 Bebas Kontrak";
        bulanKontrak=6;

    }else{

        let bulan =
        (hariIni.getFullYear()-bayarPertama.getFullYear())*12+
        (hariIni.getMonth()-bayarPertama.getMonth());

        bulanKontrak=bulan+1;

        status="🔵 Kontrak "+bulanKontrak+"/6";

    }

    return{

        bayarPertama:formatTanggal(bayarPertama),

        bebasKontrak:formatTanggal(bebasKontrak),

        status:status

    };

}

// =========================
// TAMPILKAN DATA
// =========================

function tampilkan(){

    tbody.innerHTML="";

    let keyword = cari.value.toLowerCase();

pelanggan.forEach((item,index)=>{

    if(
        !item.nama.toLowerCase().includes(keyword) &&
        !item.wa.toLowerCase().includes(keyword) &&
        !item.paket.toLowerCase().includes(keyword)
    ){
        return;
    }

        tbody.innerHTML+=`

        <tr>

        <td>${item.nama}</td>

        <td>${item.wa}</td>

        <td>${item.paket}</td>

        <td>${item.pasang}</td>

        <td>${item.bayar}</td>

        <td>${item.bebas}</td>

        <td>${item.status}</td>

        <td>
<td>

<button class="edit"
onclick="editData(${index})">
Edit
</button>

<button class="hapus"
onclick="hapus(${index})">
Hapus
function editData(index){

    nama.value = pelanggan[index].nama;
    wa.value = pelanggan[index].wa;
    alamat.value = pelanggan[index].alamat;
    paket.value = pelanggan[index].paket;
    harga.value = pelanggan[index].harga;

    pelanggan.splice(index,1);

    tampilkan();

}
</button>

</td>

        </td>

        </tr>

        `;

    });

    localStorage.setItem(
        "pelanggan",
        JSON.stringify(pelanggan)
    );

}

// =========================
// SIMPAN
// =========================

simpan.onclick=function(){

    if(
        nama.value==""||
        wa.value==""||
        alamat.value==""||
        harga.value==""||
        tanggalPasang.value==""
    ){

        alert("Lengkapi semua data.");

        return;

    }

    let hasil = hitungKontrak(tanggalPasang.value);

    pelanggan.push({

        nama:nama.value,

        wa:wa.value,

        alamat:alamat.value,

        paket:paket.value,

        harga:harga.value,

        pasang:formatTanggal(new Date(tanggalPasang.value)),

        bayar:hasil.bayarPertama,

        bebas:hasil.bebasKontrak,

        status:hasil.status

    });

    nama.value="";
    wa.value="";
    alamat.value="";
    harga.value="";
    tanggalPasang.value="";

    tampilkan();

}

// =========================
// HAPUS
// =========================

function hapus(index){

    if(confirm("Hapus pelanggan?")){

        pelanggan.splice(index,1);

        tampilkan();

    }

}

// =========================
// DARK MODE
// =========================

if(localStorage.getItem("tema")=="dark"){

    document.body.classList.add("dark");

}

darkModeBtn.onclick=function(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("tema","dark");

    }else{

        localStorage.setItem("tema","light");

    }

}

// =========================
// LOAD
// =========================

function tampilkan(){

    tbody.innerHTML="";

    let total = pelanggan.length;
    let gratis = 0;
    let kontrak = 0;
    let bebas = 0;

    pelanggan.forEach((item,index)=>{

        if(item.status.includes("Masa Gratis")){
            gratis++;
        }else if(item.status.includes("Kontrak")){
            kontrak++;
        }else{
            bebas++;
        }

        tbody.innerHTML += `
        <tr>

            <td>${item.nama}</td>
            <td>${item.wa}</td>
            <td>${item.paket}</td>
            <td>${item.pasang}</td>
            <td>${item.bayar}</td>
            <td>${item.bebas}</td>
            <td>${item.status}</td>

            <td>

                <button class="hapus"
                onclick="hapus(${index})">
                Hapus
                </button>

            </td>

        </tr>
        `;

    });

    document.getElementById("totalPelanggan").innerHTML = total;
    document.getElementById("masaGratis").innerHTML = gratis;
    document.getElementById("kontrak").innerHTML = kontrak;
    document.getElementById("bebasKontrak").innerHTML = bebas;

    localStorage.setItem("pelanggan",JSON.stringify(pelanggan));

}cari.onkeyup = function(){

    tampilkan();

}