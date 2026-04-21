import {
  Search,
  Plus,
  QrCode,
  Wrench,
  Download,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const guides = [
  {
    icon: Search,
    title: 'ค้นหาครุภัณฑ์',
    description: 'วิธีการค้นหาครุภัณฑ์ด้วยรหัสหรือสแกน QR Code',
    steps: [
      'ไปที่เมนู "ค้นหาครุภัณฑ์"',
      'พิมพ์รหัสครุภัณฑ์ในช่องค้นหา หรือเลือกแท็บ "สแกน QR"',
      'ระบบจะแสดงผลลัพธ์ที่ตรงกับคำค้นหา',
      'คลิกที่รายการเพื่อดูรายละเอียดเพิ่มเติม',
    ],
  },
  {
    icon: Plus,
    title: 'เพิ่มครุภัณฑ์ใหม่',
    description: 'ขั้นตอนการลงทะเบียนครุภัณฑ์ใหม่เข้าระบบ',
    steps: [
      'ไปที่เมนู "เพิ่มครุภัณฑ์"',
      'กรอกรหัสครุภัณฑ์ในรูปแบบ XXXX-XXX-XXXX',
      'กรอกชื่อ ประเภท สถานที่ และรายละเอียดอื่นๆ',
      'ตรวจสอบข้อมูลและกด "บันทึก"',
    ],
  },
  {
    icon: QrCode,
    title: 'สร้าง QR Code',
    description: 'วิธีการสร้างและพิมพ์ QR Code สำหรับติดครุภัณฑ์',
    steps: [
      'ไปที่เมนู "สร้าง QR Code"',
      'กรอกรหัสครุภัณฑ์ที่ต้องการสร้าง QR Code',
      'เลือกขนาด QR Code ที่ต้องการ',
      'กด "สร้าง QR Code" และดาวน์โหลดไฟล์',
    ],
  },
  {
    icon: Wrench,
    title: 'แจ้งซ่อมครุภัณฑ์',
    description: 'ขั้นตอนการแจ้งซ่อมบำรุงครุภัณฑ์',
    steps: [
      'ไปที่เมนู "แจ้งซ่อม"',
      'กรอกรหัสครุภัณฑ์ที่ต้องการแจ้งซ่อม',
      'เลือกระดับความเร่งด่วนและอธิบายปัญหา',
      'แนบไฟล์รูปภาพ (ถ้ามี) และกด "ส่งแจ้งซ่อม"',
    ],
  },
];

const faqs = [
  {
    question: 'ระบบรองรับรหัสครุภัณฑ์รูปแบบไหน?',
    answer:
      'ระบบรองรับรหัสครุภัณฑ์ในรูปแบบ XXXX-XXX-XXXX โดยเลขชุดแรก 4 หลักคือรหัสประเภท ชุดที่สอง 3 หลักคือรหัสหน่วยงาน และชุดที่สาม 4 หลักคือลำดับครุภัณฑ์',
  },
  {
    question: 'ฉันสามารถแก้ไขข้อมูลครุภัณฑ์ได้ไหม?',
    answer:
      'ได้ หากคุณมีสิทธิ์ผู้ดูแลระบบหรือเจ้าหน้าที่ สามารถแก้ไขข้อมูลได้โดยคลิกที่รายการครุภัณฑ์ แล้วเลือก "แก้ไข" จากเมนู',
  },
  {
    question: 'QR Code ที่สร้างสามารถใช้งานได้นานแค่ไหน?',
    answer:
      'QR Code ที่สร้างไม่มีวันหมดอายุ สามารถใช้งานได้ตลอดไปตราบใดที่รหัสครุภัณฑ์ยังมีอยู่ในระบบ',
  },
  {
    question: 'ใครสามารถเห็นรายงานแจ้งซ่อมของฉันได้บ้าง?',
    answer:
      'รายงานแจ้งซ่อมจะถูกส่งไปยังผู้ดูแลระบบและเจ้าหน้าที่ซ่อมบำรุงที่เกี่ยวข้อง คุณสามารถติดตามสถานะได้ในเมนู "แจ้งซ่อม"',
  },
  {
    question: 'ระบบรองรับเบราว์เซอร์อะไรบ้าง?',
    answer:
      'ระบบรองรับ Google Chrome, Mozilla Firefox, Microsoft Edge และ Safari เวอร์ชันล่าสุด รวมถึงเบราว์เซอร์บนมือถือ',
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="ช่วยเหลือ"
        description="คู่มือการใช้งานและคำถามที่พบบ่อย"
      />

      {/* Quick Guides */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">คู่มือการใช้งาน</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <guide.icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{guide.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {guide.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex gap-2">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {stepIndex + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">คำถามที่พบบ่อย</h2>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* Contact Support */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">ติดต่อทีมสนับสนุน</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-sm">support@eng.swu.ac.th</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-muted-foreground" />
                  <span className="text-sm">02-xxx-xxxx ต่อ 1234</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a
                    href="mailto:support@eng.swu.ac.th"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="mr-2 size-4" />
                    ส่งอีเมล
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://eng.swu.ac.th"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 size-4" />
                    เว็บไซต์คณะ
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Download Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">ดาวน์โหลดเอกสาร</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {/* <Button variant="outline">
                <Download className="mr-2 size-4" />
                คู่มือการใช้งาน PDF
              </Button> */}
              <Button variant="outline">
                <Download className="mr-2 size-4" />
                แบบฟอร์มแจ้งซ่อม
              </Button>
              <Button variant="outline">
                <Download className="mr-2 size-4" />
                ระเบียบการใช้ครุภัณฑ์
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
