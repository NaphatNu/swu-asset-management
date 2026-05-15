import {
  Search,
  Plus,
  QrCode,
  Wrench,
  ClipboardCheck,
  History,
  LayoutDashboard,
  Package,
  User,
  LogIn,
} from 'lucide-react';

import { PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const guides = [
  {
    icon: LogIn,
    title: 'เข้าสู่ระบบ',
    description: 'เข้าสู่ระบบด้วยบัญชี Microsoft',
    steps: [
      'เปิดหน้าเข้าสู่ระบบ',
      'กดปุ่ม "Login with Microsoft"',
      'เข้าสู่ระบบด้วยบัญชี Microsoft',
      'เมื่อเข้าสู่ระบบสำเร็จ ระบบจะพาไปยังหน้าหลัก',
    ],
  },
  {
    icon: LayoutDashboard,
    title: 'แดชบอร์ด',
    description: 'ดูภาพรวมสถานะครุภัณฑ์ภายในระบบ',
    steps: [
      'เปิดเมนู "แดชบอร์ด"',
      'ตรวจสอบจำนวนครุภัณฑ์ในแต่ละสถานะ',
      'ดูข้อมูลจำนวนรายการซ่อมและจำหน่าย',
      'ดูกราฟสรุปสถานะครุภัณฑ์',
    ],
  },
  {
    icon: Package,
    title: 'รายการครุภัณฑ์',
    description: 'ค้นหา ดูรายละเอียด และจัดการข้อมูลครุภัณฑ์',
    steps: [
      'เปิดเมนู "รายการครุภัณฑ์"',
      'ใช้ช่องค้นหาเพื่อค้นหาชื่อครุภัณฑ์',
      'กรองข้อมูลตามสถานที่ สถานะ หรือสภาพ',
      'สลับมุมมองแบบตารางหรือการ์ด',
      'คลิกที่รายการเพื่อดูรายละเอียด',
      'ใช้เมนูเพิ่มเติมเพื่อแก้ไข สร้าง QR Code หรือแจ้งซ่อม',
    ],
  },
  {
    icon: Plus,
    title: 'เพิ่มครุภัณฑ์ใหม่',
    description: 'ลงทะเบียนครุภัณฑ์ใหม่เข้าสู่ระบบ',
    steps: [
      'ไปที่เมนู "เพิ่มครุภัณฑ์"',
      'กรอกรหัสครุภัณฑ์และรหัสหลัก',
      'กรอกชื่อครุภัณฑ์',
      'เลือกสถานที่ สถานะ และสภาพของครุภัณฑ์',
      'เลือกวันที่จัดซื้อหรือวันที่รับเข้า',
      'ตรวจสอบข้อมูลแล้วกด "บันทึก"',
    ],
  },
  {
    icon: Search,
    title: 'ค้นหาครุภัณฑ์',
    description: 'ค้นหาข้อมูลครุภัณฑ์ด้วยรหัสหรือสแกน QR Code',
    steps: [
      'ไปที่เมนู "ค้นหาครุภัณฑ์"',
      'เลือกแท็บ "สแกน QR" หรือ "กรอกข้อมูล"',
      'กรอกรหัสครุภัณฑ์แล้วกดค้นหา หรือสแกน QR Code',
      'ระบบจะแสดงรายละเอียดครุภัณฑ์',
      'สามารถเปิดหน้ารายละเอียดเพิ่มเติมได้',
    ],
  },
  {
    icon: QrCode,
    title: 'สร้าง QR Code',
    description: 'สร้างและดาวน์โหลด QR Code สำหรับครุภัณฑ์',
    steps: [
      'ไปที่เมนู "สร้าง QR Code"',
      'กรอกรหัสครุภัณฑ์',
      'เลือกขนาด QR Code',
      'กดปุ่ม "Create QR Code"',
      'กด "Download PNG" เพื่อดาวน์โหลดไฟล์',
    ],
  },
  {
    icon: Wrench,
    title: 'แจ้งซ่อมครุภัณฑ์',
    description: 'สร้างรายการแจ้งซ่อมและดูประวัติการแจ้งซ่อม',
    steps: [
      'ไปที่เมนู "แจ้งซ่อม"',
      'เลือกแท็บ "แจ้งซ่อมใหม่"',
      'กรอกรหัสครุภัณฑ์',
      'กรอกรายละเอียดปัญหา',
      'เลือกสถานะการซ่อม',
      'กดบันทึกเพื่อส่งรายการแจ้งซ่อม',
      'ระบบจะกลับไปยังหน้ารายการแจ้งซ่อม',
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'ตรวจสอบครุภัณฑ์',
    description: 'บันทึกผลการตรวจสอบสภาพครุภัณฑ์',
    steps: [
      'ไปที่เมนู "ประเมินครุภัณฑ์"',
      'กรอกรหัสครุภัณฑ์',
      'เลือกสภาพของครุภัณฑ์',
      'กรอกรายละเอียดเพิ่มเติม',
      'เลือกอัปเดตสถานะหากต้องการ',
      'กดบันทึกข้อมูลการตรวจสอบ',
    ],
  },
  {
    icon: History,
    title: 'ประวัติกิจกรรม',
    description: 'ดูประวัติการเปลี่ยนแปลงและกิจกรรมของครุภัณฑ์',
    steps: [
      'ไปที่เมนู "ประวัติกการทำรายการ"',
      'ค้นหาข้อมูลด้วยชื่อครุภัณฑ์',
      'กรองข้อมูลตามประเภทกิจกรรมหรือช่วงวันที่',
      'สลับมุมมองแบบตารางหรือการ์ด',
      'คลิกที่รายการเพื่อดูรายละเอียดเพิ่มเติม',
      'สามารถสร้าง QR Code หรือแจ้งซ่อมจากรายการประวัติได้',
    ],
  },
  {
    icon: User,
    title: 'โปรไฟล์ผู้ใช้งาน',
    description: 'ดูข้อมูลบัญชีผู้ใช้งานและบัญชี Microsoft ที่เชื่อมต่อ',
    steps: [
      'ไปที่เมนู "โปรไฟล์"',
      'ตรวจสอบชื่อ อีเมล และข้อมูลหน่วยงาน',
      'ดูสถานะการเชื่อมต่อบัญชี Microsoft',
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ช่วยเหลือ"
        description="คู่มือการใช้งานระบบจัดการครุภัณฑ์"
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          คู่มือการใช้งาน
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <guide.icon className="size-5" />
                  </div>

                  <div>
                    <CardTitle className="text-base">
                      {guide.title}
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                      {guide.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ol className="space-y-2 text-sm">
                  {guide.steps.map((step, stepIndex) => (
                    <li
                      key={stepIndex}
                      className="flex gap-2"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {stepIndex + 1}
                      </span>

                      <span className="text-muted-foreground">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}