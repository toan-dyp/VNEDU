class MonHoc {
  constructor(ten, tx, gk, ck){
    this.ten = ten;
    this.tx = tx;
    this.gk = gk;
    this.ck = ck;
  }

  get dtb(){
    var dem = 0;
    var tong = 0;
    for(var i of this.tx) dem++, tong+=i;
    for(var i of this.gk) dem+=2, tong+=i*2;
    for(var i of this.ck) dem+=3, tong+=i*3;
    return parseFloat((tong/(dem*1.0)).toFixed(1));
  }
}

class Hoc_sinh {
  constructor(ten, url, lop, hocba, hocky){
    this.ten = ten;
    this.url = url;
    this.lop = lop;
    this.hocba = this.lay_Hocba(hocba, hocky);
  }

  lay_diem(v){
    var temp = v.querySelectorAll("td:last-child")[0].innerText.split("  ");
    if(temp.length!=1 || temp[temp.length-1].length < 1) temp.length--;
    return temp.map(Number);
  }
  
  lay_mon(value, i, hocky){
    var mons = ["Toán", "Lý", "Hoá", "Sinh", "Tin", "Ngữ Văn", "Lịch Sử", "Địa lí", "Ngoại ngữ", "GDCD", "Công nghệ", "Thể dục", "GDQP"];
    var mon = value.querySelectorAll("tr");
    if(hocky != 0) return new MonHoc(mons[(i-2)/4], this.lay_diem(mon[i + 0]), this.lay_diem(mon[i + 1]), this.lay_diem(mon[i + 2]));
    return new MonHoc(mons[i], this.lay_diem(mon[i+2]),  this.lay_diem(mon[i+2]),  this.lay_diem(mon[i+2]));
  }

  lay_Hocba(value, hocky){
    var mon = [];
    for(var i = 0; i < 13; i++){
      if(hocky != 0) mon.push(this.lay_mon(value, 2 + i*4));
      else mon.push(this.lay_mon(value, i, hocky));
    }
    return mon;
  }

  get dtb(){
    var dem = 0;
    var tong = 0;
    for(var i of this.hocba){
      if(!isNaN(i.dtb)) dem++, tong+=i.dtb;
    }
    return parseFloat((tong/(dem*1.0)).toFixed(1));
  }
}