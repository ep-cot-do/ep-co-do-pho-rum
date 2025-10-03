export interface CoreMember {
  name: string;
  role: string;
  description: string;
  studentCode: string;
  email?: string | null;
  facebook?: string | null;
  image?: string | null;
}

export interface MemberGeneration {
  title: string;
  members: CoreMember[];
}

export interface ImageErrorState {
  [key: string]: boolean;
}

export type CoreMembersData = MemberGeneration[];

export const coreMembersData: CoreMembersData = [
  {
    title: "Gen 6 - Current Generation",
    members: [
      {
        name: "Nguyễn Duy Khánh",
        role: "President & Head of Academics",
        description: "Gen 6 President - Head of Academics",
        studentCode: "CE200196",
        email: "KhanhNDCE200196@gmail.com",
        facebook: "https://www.facebook.com/mrdonutmanvn",
        image: "/images/members/nguyen-duy-khanh.jpg",
      },
      {
        name: "Nguyễn Võ Nhật Duy",
        role: "Head of Events & Head of Communications",
        description: "Gen 6 Head of Events and Communications",
        studentCode: "CE201168",
        email: "Duynvnce201168@gmail.com",
        facebook: "https://www.facebook.com/nhatduy.76dyy",
        image: "/images/members/nguyen-vo-nhat-duy.jpg",
      },
      {
        name: "Nguyễn Văn Hùng",
        role: "Head of Human Resources & Deputy of Events",
        description: "Gen 6 HR Head and Deputy Event Manager",
        studentCode: "CE200312",
        email: "hungnvce200312@gmail.com",
        facebook: "https://www.facebook.com/nguyen.hung.895047/",
        image: "/images/members/nguyen-van-hung.jpg",
      },
      {
        name: "Nguyễn Hồ Phước An",
        role: "Deputy Head of Academics",
        description: "Gen 6 Deputy Head of Academics",
        studentCode: "CE190747",
        email: "annhp.ce190747@gmail.com",
        facebook: "https://www.facebook.com/phuocan.nguyenho.75/",
        image: "/images/members/nguyen-ho-phuoc-an.jpg",
      },
      {
        name: "Nguyễn Thị Huỳnh Mai",
        role: "Deputy Head of Communications & HR",
        description: "Gen 6 Deputy Head of Communications and HR",
        studentCode: "CE200149",
        email: "mainthce200149@gmail.com",
        facebook: "https://www.facebook.com/huynh.mai.461899/",
        image: "/images/members/nguyen-thi-huynh-mai.jpg",
      },
    ],
  },
  {
    title: "Gen 5 - Previous Generation",
    members: [
      {
        name: "Nguyễn Kim Bảo Nguyên",
        role: "President",
        description: "Generation 5 President",
        studentCode: "CE191239",
        email: "nguyennkb.ce191239@gmail.com",
        facebook: "https://www.facebook.com/BonlaBonlaBon",
        image: "/images/members/nguyen-kim-bao-nguyen.jpg",
      },
      {
        name: "Lê Nhựt Anh",
        role: "Head of Academics",
        description:
          "Head of Academics - Golden Toad of Engineering Department Spring 2024",
        studentCode: "CE181767",
        email: "lnanh2k4@gmail.com",
        facebook: "https://www.facebook.com/lnanh2k4",
        image: "/images/members/le-nhut-anh.jpg",
      },
      {
        name: "Trương Đoàn Minh Phúc",
        role: "Head of Human Resources",
        description: "Head of HR",
        studentCode: "CE190744",
        email: "phuctdm.ce190744@gmail.com",
        facebook: "https://www.facebook.com/minh.phuc1605",
        image: "/images/members/truong-doan-minh-phuc.jpg",
      },
      {
        name: "Nguyễn Quang Huy",
        role: "Head of Communications",
        description: "Head of Communications",
        studentCode: "CE190976",
        email: "huyquangst123@gmail.com",
        facebook: "https://www.facebook.com/profile.php?id=100091569385577",
        image: "/images/members/nguyen-quang-huy.jpg",
      },
      {
        name: "Châu Tấn Cường",
        role: "Head of Events",
        description: "Head of Events",
        studentCode: "CE190026",
        email: "cuongct.ce190026@gmail.com",
        facebook: "https://www.facebook.com/chau.tan.cuong.365420",
        image: "/images/members/chau-tan-cuong.jpg",
      },
    ],
  },
  {
    title: "Gen 4 - Legacy Generation",
    members: [
      {
        name: "Trần Đại Nhân",
        role: "President",
        description: "Former President of Generation 4",
        studentCode: "CE181526",
        facebook: "https://www.facebook.com/profile.php?id=100093588205512",
        image: "/images/members/tran-dai-nhan.jpg",
      },
      {
        name: "Nguyễn Lê Ngọc Minh",
        role: "Vice President of External Affairs",
        description: "VP of External Affairs",
        studentCode: "CE181669",
        facebook: "https://www.facebook.com/profile.php?id=100022917194543",
        image: "/images/members/nguyen-le-ngoc-minh.jpg",
      },
      {
        name: "Nguyễn Hoàng Đạt",
        role: "Vice President of Internal Affairs",
        description: "VP of Internal Affairs",
        studentCode: "CE180797",
        facebook: "https://www.facebook.com/profile.php?id=100019930087722",
        image: "/images/members/nguyen-hoang-dat.jpg",
      },
      {
        name: "Lê Thịnh",
        role: "Secretary",
        description: "Secretary of Generation 4",
        studentCode: "CE180136",
        facebook: "https://www.facebook.com/profile.php?id=100045708382964",
        image: "/images/members/le-thinh.jpg",
      },
      {
        name: "Phan Văn Hòa Thuận",
        role: "Vice President of Internal Affairs",
        description: "Vice President of Internal Affairs & Former Treasurer",
        studentCode: "CE181377",
        facebook: "https://www.facebook.com/fatadi127",
        image: "/images/members/phan-van-hoa-thuan.jpg",
      },
      {
        name: "Bạch Công Chính",
        role: "Treasurer",
        description: "Treasurer of Generation 4.1",
        studentCode: "CE181383",
        facebook: "https://www.facebook.com/chinhthcspm",
        image: "/images/members/bach-cong-chinh.jpg",
      },
    ],
  },
  {
    title: "Gen 3 - Legacy Generation",
    members: [
      {
        name: "Nguyễn Vũ Như Huỳnh",
        role: "President",
        description: "Former President of Generation 3",
        studentCode: "CE170550",
        facebook: "https://www.facebook.com/huynhvugenius",
        image: "/images/members/nguyen-vu-nhu-huynh.jpg",
      },
      {
        name: "Nguyễn Hoàng Khang",
        role: "Vice President",
        description: "Former Vice President of Generation 3",
        studentCode: "",
        facebook: "https://www.facebook.com/niraitoo",
        image: "/images/members/nguyen-hoang-khang.jpg",
      },
      {
        name: "Võ Hoàng Phúc",
        role: "Vice President",
        description:
          "Former Vice President - Left the Club - Former F-SEC Executive",
        studentCode: "",
        facebook: "https://www.facebook.com/phuc.vo233",
        image: "/images/members/vo-hoang-phuc.jpg",
      },
      {
        name: "Phan Hồng Phúc",
        role: "Vice President",
        description: "Former Vice President - Golden Toad",
        studentCode: "",
        facebook: "https://www.facebook.com/profile.php?id=100013159694804",
        image: "/images/members/phan-hong-phuc.jpg",
      },
      {
        name: "Nguyễn Thị Trà My",
        role: "Treasurer",
        description: "Former Treasurer of Generation 3",
        studentCode: "",
        facebook: "https://www.facebook.com/profile.php?id=100013821842470",
        image: "/images/members/nguyen-thi-tra-my.jpg",
      },
      {
        name: "Nguyễn Thị Diễm Hương",
        role: "Secretary",
        description: "Former Secretary of Generation 3",
        studentCode: "CE171360",
        facebook: "https://www.facebook.com/dylanruan1210",
        image: "/images/members/nguyen-thi-diem-huong.jpg",
      },
      {
        name: "Huỳnh Gia Phát",
        role: "Communications Manager",
        description: "Former Communications Manager",
        studentCode: "",
        facebook: "https://www.facebook.com/phat.gia.56679015",
        image: "/images/members/huynh-gia-phat.jpg",
      },
      {
        name: "Hứa Khánh Huy",
        role: "Secretary",
        description: "Former Secretary of Generation 3",
        studentCode: "CE171778",
        facebook: "https://www.facebook.com/khanhuy0915",
        image: "/images/members/hua-khanh-huy.jpg",
      },
    ],
  },
  {
    title: "Gen 2 - Founding Generation",
    members: [
      {
        name: "Võ Ngọc Thiên",
        role: "President",
        description: "Former President of Generation 2",
        studentCode: "",
        facebook: "https://www.facebook.com/ngocthien.vo.988",
        image: "/images/members/vo-ngoc-thien.jpg",
      },
      {
        name: "Phạm Trường Phú",
        role: "Vice President",
        description: "Former Vice President - Left the Club",
        studentCode: "",
        facebook: "https://www.facebook.com/jamesphoenixf",
        image: "/images/members/pham-truong-phu.jpg",
      },
      {
        name: "Nguyễn Quỳnh Anh",
        role: "Vice President",
        description: "Former Vice President - Left the Club - Golden Toad",
        studentCode: "",
        facebook: "https://www.facebook.com/nanh1122",
        image: "/images/members/nguyen-quynh-anh.jpg",
      },
      {
        name: "Trần Văn Hảo",
        role: "Treasurer",
        description: "Former Treasurer of Generation 2",
        studentCode: "",
        facebook: "https://www.facebook.com/hao.tranvan.96343",
        image: "/images/members/tran-van-hao.jpg",
      },
      {
        name: "Đặng Minh Cảnh",
        role: "Secretary",
        description: "Former Secretary - Golden Toad",
        studentCode: "",
        facebook: "https://www.facebook.com/poiminhcanh08092001",
        image: "/images/members/dang-minh-canh.jpg",
      },
      {
        name: "Nguyễn Ngọc Mỹ Quyên",
        role: "Treasurer",
        description: "Former Treasurer of Generation 2",
        studentCode: "",
        facebook: "https://www.facebook.com/my.quyen.5249",
        image: "/images/members/nguyen-ngoc-my-quyen.jpg",
      },
    ],
  },
  {
    title: "Gen 1 - Founder",
    members: [
      {
        name: "Tấn Phát",
        role: "President",
        description: "Founder and First President of F-Coder Club",
        studentCode: "",
        facebook: "https://www.facebook.com/grexptp",
        image: "/images/members/tan-phat.jpg",
      },
    ],
  },
];
