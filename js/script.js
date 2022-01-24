function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var stringToHTML = function (t) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(t, 'text/html');
  return doc.body;
};

var lay_danh_sach = async (hocky) => {
  var promises = [], temp = [];
  await 
  Lop12.forEach((value, index) =>{
    promises.push($.ajax({
      url: value,
      data: {hoc_ky_id: hocky}
    }))
  })
  await 
  Promise.all(promises)
  .then(data => {
    data.forEach((value, index) => {
      if(value != 'Bạn chưa đăng ký sử dụng Sổ liên lạc điện tử vnEdu cho lớp học này!'){
        var html = stringToHTML(value).querySelectorAll("tr b");
        var ten = html[0].innerHTML, lop = html[1].innerHTML;
        var value = stringToHTML(data[index]).querySelectorAll("table")[1];
        temp.push(new Hoc_sinh(ten, Lop12[index] + `&hoc_ky_id=${hocky}`, lop, value));
      }
    })
  })
  return temp;
}

var HocKy = [];

async function lay_thong_tin(){
  HocKy = [
    await lay_danh_sach(1),
    await lay_danh_sach(2),
  ]
}

//=============================

$(document).ready(function(){
});

$("#tai").click(async()=>{
  $('#tai').prop('disabled', true);
  await lay_thong_tin();
  console.log(HocKy);
  $('#sh').removeClass('d-none');
  $("#lding").addClass("d-none");
  $("#done").removeClass("d-none");
  await sleep(500);
  $('#staticBackdrop').modal('hide');
  await sleep(200);
  $('#tai').prop('disabled', false);
  $("#done").addClass("d-none");
  $("#lding").removeClass("d-none");
})

$("#loai").change(()=>{
  if($("#loai").val() == 0) $("#mon").addClass("d-none");
  else $("#mon").removeClass("d-none");
})

$("#lop").change(()=>{
  if($("#lop").val() == 0) $("#tunglop").addClass("d-none");
  else $("#tunglop").removeClass("d-none");
})

//==============================
var OO=['I','II'];

$("#action").click(()=>{
  $("#closeoff").click();
  $("#TENMON").text("");
  var hocky = $('#hocky').val();
  var loai  = $('#loai').val(), mon = 0;
  var lop   = $('#lop').val(), 
  tunglop = {
    '12A01':1,
    '12A02':1,
    '12A03':1,
    '12A04':1,
    '12A05':1,
    '12A06':1,
    '12A07':1,
    '12A08':1,
    '12A09':1,
    '12A10':1,
    '12A11':1,
    '12A12':1,
    '12A13':1,
    '12A14':1,
  };
  
  if(lop == 1)
    for(var i = 1; i<15; i++) 
      if($(`#12A${i}`).is(':Checked')) tunglop[`12A${i<10?`0${i}`:i}`] = 1;
      else tunglop[`12A${i<10?`0${i}`:i}`] = 0;

  if(loai == 0){
    HocKy[hocky].sort((a,b) => {
      var c = (isNaN(a.dtb)?0:a.dtb);
      var d = (isNaN(b.dtb)?0:b.dtb);
      return d - c;
    })
    $("#p").empty();
    $("#p").append(`<table class="table sticky-header">
      <thead>
        <tr style="background:white">
          <th scope="col">Tên</th>
          <th scope="col">Lớp</th>
          <th scope="col">ĐTB HK${OO[hocky]}</th>
          <th scope="col">Hạng</th>
        </tr>
      </thead>
      <tbody id = "ne">
      </tbody>
    </table>`);

    $(".sticky-header").floatThead({top:50});
    var hang = 1, tam = 1, diem_nguoi_truoc = -1, check = 0;
    HocKy[hocky].forEach((value) =>{
      if(tunglop[value.lop] == 1 || lop == 0){
        if(check != 0){
          if(value.dtb == diem_nguoi_truoc) tam++;
          else hang+=tam, tam = 1;
        }
        check++;
        $("#ne").append(`<tr>
          <td><a href="#" onclick="mohocba('${value.url}'); return false;">${value.ten}</a></td>
          <td>${value.lop}</td>
          <td>${(isNaN(value.dtb)?"":value.dtb)}</td>
          <td>${hang}</td>
        </tr>`);
        diem_nguoi_truoc = value.dtb;
      }
    })
  } else {
    mon = $("#mon").val();
    HocKy[hocky].sort((a,b) => {
      var c = (isNaN(a.hocba[mon].dtb)?0:a.hocba[mon].dtb);
      var d = (isNaN(b.hocba[mon].dtb)?0:b.hocba[mon].dtb);
      return d - c;
    })
    $("#TENMON").text(HocKy[hocky][0].hocba[mon].ten);
    $("#p").empty();
    $("#p").append(`<table class="table sticky-header">
      <thead>
        <tr style="background:white">
          <th scope="col">Tên</th>
          <th scope="col">Lớp</th>
          <th scope="col">Thường xuyên</th>
          <th scope="col">GK</th>
          <th scope="col">CK</th>
          <th scope="col">TBM HK${OO[hocky]}</th>
          <th scope="col">Hạng</th>
        </tr>
      </thead>
      <tbody id = "ne">
      </tbody>
    </table>`);
    $(".sticky-header").floatThead({top:50});
    var hang = 1, tam = 1, diem_nguoi_truoc = -1, check = 0;
    HocKy[hocky].forEach((value) =>{
      if(tunglop[value.lop] == 1 || lop == 0){
        if(check != 0){
          if(value.hocba[mon].dtb == diem_nguoi_truoc) tam++;
          else hang+=tam, tam = 1;
        }
        check++;
        $("#ne").append(`<tr>
          <th scope="row">${check}</th>
          <td><a href="#" onclick="mohocba('${value.url}'); return false;">${value.ten}</a></td>
          <td>${value.lop}</td>
          <td>${value.hocba[mon].tx}</td>
          <td>${value.hocba[mon].gk}</td>
          <td>${value.hocba[mon].ck}</td>
          <td>${(isNaN(value.hocba[mon].dtb)?"":value.hocba[mon].dtb)}</td>
          <td>${hang}</td>
        </tr>`);
        diem_nguoi_truoc = value.hocba[mon].dtb;
      }
    })
  }
})

function mohocba(url){
  $("#dayne").empty();
  $("#dayne").append(`
  <iframe style="overflow: hidden;" scrolling="no" width="100%" height="99%" src="${url}" ></iframe>
  `);
  $("#clickdayne").click()
}