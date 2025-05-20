"use client";
import { QuickLinks } from "@/components/QuickLinks";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Footer from "@/components/Footer";
export default function GeneralKnowledge() {
  // npx shadcn@latest add sidebar
  // npx shadcn@latest add card

  const [searchActive, setSearchActive] = useState(false);
  console.log(searchActive);
  return (
    <SidebarProvider className="flex flex-col">
      <Navbar setSearchActive={setSearchActive} />
      <div className="items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[NeueMontreal-Medium]">
        <div className="flex flex-row">
          <div className="w-[16rem]">
            <div className="sticky top-24 self-start">
              <QuickLinks />
            </div>
          </div>
          <div className="w-full max-w-4xl mx-auto flex flex-col">
            <Card className="flex flex-col-reverse md:flex-row-reverse justify-between gap-4 p-4">
              <div>
                <CardTitle id="clipper-crash-course">
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Clippers Crash Course
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">
                  What do the numbers mean, Mason?
                </CardDescription>
                <CardContent>
                  <p className="text-xs">
                    Hair clipper numbers refer to the guard sizes attached to
                    the clipper, which determine how much hair is left after
                    cutting. These numbers usually range from 0 to 8, with lower
                    numbers (like #0 or #1) cutting hair very short, close to
                    the scalp, and higher numbers (like #7 or #8) leaving longer
                    lengths. For instance, a #1 guard typically leaves hair
                    about 1/8 inch long, while a #8 guard leaves around an inch.
                    It is important to note that different brands may have
                    slight variations, so consulting the guide provided with the
                    clippers is a good idea. Other essentials include
                    maintaining sharp blades, using clipper oil to reduce
                    friction, and cleaning the clippers regularly to ensure
                    precise cuts. Whether you are aiming for a fade, a buzz cut,
                    or just a quick trim, mastering the clipper settings is key
                    to achieving the desired style!
                  </p>
                </CardContent>
              </div>
              <Image
                width={160}
                height={96}
                src="/barber_utensils_wide.png"
                alt="barber equipment"
                className="rounded-lg w-full md:w-[160px] h-auto object-cover"
              />
            </Card>
            <svg height={60} id="barber-essentials"></svg>
            <Card className="flex flex-col md:flex-row justify-between gap-4 p-4">
              <div>
                <CardTitle>
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Barber Essentials
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">
                  Be the sharpest tool in the shed.
                </CardDescription>
                <CardContent>
                  <p className="text-xs">
                    Industry-standard barber supplies include high-quality
                    clippers and trimmers from brands like Wahl, Andis, and
                    BabylissPro, which are essential for precision cutting and
                    styling. Other must-haves are professional-grade shears,
                    combs, razors, and shaving brushes, along with sanitizing
                    solutions like Barbicide to maintain hygiene. Comfortable
                    and adjustable barber chairs, along with handheld and
                    wall-mounted mirrors, are also key for creating a
                    professional setup. For purchasing these supplies, you can
                    explore
                    <a
                      className="text-[#FF4649]"
                      href="https://modernbarbersupply.com/"
                      target="_blank"
                    >
                      Modern Barber Supply
                    </a>{" "}
                    or{" "}
                    <a
                      className="text-[#FF4649]"
                      href="https://www.barberdepots.com/"
                      target="_blank"
                    >
                      Barber Depot
                    </a>
                    , which offer a wide range of trusted products for barbers.
                  </p>
                </CardContent>
              </div>
              <Image
                width={160}
                height={96}
                src="/clippers.jpg"
                alt="trimmers"
                className="rounded-lg w-full md:w-[160px] h-auto object-cover"
              />
            </Card>
            <svg height={60} id="barber-shop-etiquette"></svg>
            <Card className="flex flex-col-reverse md:flex-row-reverse justify-between gap-4 p-4">
              <div>
                <CardTitle id="barber-shop-etiquette">
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Barber Shop Etiquette
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">
                  Come in informed and prepared.
                </CardDescription>
                <CardContent>
                  <p className="text-xs">
                    Proper barbershop etiquette involves arriving on time for
                    your appointment or being prepared to wait if you are a
                    walk-in. Communicate clearly with your barber about the
                    style you want, using reference pictures if possible, and
                    trust their expertise for recommendations. Make sure your
                    hair is clean before your visit, as it makes the process
                    smoother. Be courteous by not using your phone excessively,
                    respecting the barber <span>&apos</span>s time, and tipping
                    appropriately—usually 15-20% of the service cost. If you are
                    unsure about barber policy or pricing, it is perfectly fine
                    to ask in advance. Barbershops are also social hubs, so do
                    not hesitate to join in on light conversation while keeping
                    the atmosphere pleasant and respectful!
                  </p>
                </CardContent>
              </div>
              <Image
                width={160}
                height={96}
                src="/barbershop.jpg"
                alt="barbershop"
                className="rounded-lg w-full md:w-[160px] h-auto object-cover"
              />
            </Card>
            <svg height={60} id="beard-care-essentials"></svg>
            <Card className="flex flex-col md:flex-row justify-between gap-4 p-4">
              <div>
                <CardTitle id="beard-care-essentials">
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Beard Care
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">
                  Beard care essentials.
                </CardDescription>
                <CardContent>
                  <p className="text-xs">
                    To maintain a healthy, well-groomed beard, start by washing
                    it regularly with a beard-specific shampoo to keep it clean
                    without stripping natural oils. Moisturize with a beard oil
                    or balm to hydrate both the hair and the skin underneath,
                    preventing dryness and irritation. Trim your beard regularly
                    to maintain shape and remove split ends. Use a beard comb or
                    brush to keep hairs aligned and to distribute oils evenly.
                    Finally, remember to eat a balanced diet, as proper
                    nutrition supports beard growth and strength.
                  </p>
                  <p className="text-xs font-bold mt-2">Beard Essentials:</p>
                  <ol className="list-decimal ml-5 text-xs">
                    <li>
                      Beard Shampoo – to cleanse without drying out your hair.
                    </li>
                    <li>
                      Beard Oil/Balm – for hydration and a soft, healthy beard.
                    </li>
                    <li>Beard Comb/Brush – to detangle and style.</li>
                    <li>Beard Scissors/Trimmer – for shaping and trimming.</li>
                  </ol>
                </CardContent>
              </div>
              <Image
                width={160}
                height={96}
                src="/beard.jpg"
                alt="hair oil"
                className="rounded-lg w-full md:w-[160px] h-auto object-cover"
              />
            </Card>
            <svg height={60} id="proper-hygiene"></svg>
            <Card className="flex flex-col-reverse md:flex-row-reverse justify-between gap-4 p-4">
              <div>
                <CardTitle>
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Proper Hygiene
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">
                  Clean Head = Clean Cut
                </CardDescription>
                <CardContent>
                  <p className="text-xs">
                    Before heading to the barbershop, practicing proper hygiene
                    is not just courteous—it makes the haircutting process
                    easier and more enjoyable for both you and your barber.
                    Start by washing your hair thoroughly to remove any dirt,
                    oil, or product buildup, as clean hair is simpler to cut and
                    style. If you&#39;re sweating or coming from a workout, a
                    quick shower helps ensure you&#39;re fresh and comfortable.
                    Pay attention to your scalp health, too—if you have dandruff
                    or irritation, addressing it beforehand can improve your
                    overall experience. Additionally, trim excessive facial hair
                    or clean your neckline if you expect these areas to be
                    groomed. Arriving clean and prepared shows respect for your
                    barber&#39;s time and equipment, maintaining a professional
                    and pleasant environment for everyone.
                  </p>
                </CardContent>
              </div>
              <Image
                width={160}
                height={96}
                src="/shower.jpg"
                alt="shower"
                className="rounded-lg w-full md:w-[160px] h-auto object-cover"
              />
            </Card>
            <svg height={60} id="haircuts-for-face-shapes"></svg>
            <Card className="flex flex-col md:flex-row justify-between gap-4 p-4">
              <div>
                <CardTitle>
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Haircuts for Different Face Shapes
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">
                  Find the perfect style for your face.
                </CardDescription>
                <CardContent>
                  <p className="text-xs">
                    The shape of your face plays a significant role in
                    determining which haircuts will flatter your features. For
                    example, round faces look great with angular cuts, like a
                    pompadour or quiff, while square faces benefit from softer,
                    textured cuts. Oval faces are versatile and can pull off
                    most styles, from buzz cuts to longer, flowing hairstyles.
                    If you have a heart-shaped face, a textured fringe or
                    side-parted style can balance the proportions. Understanding
                    your face shape is key to choosing a haircut that enhances
                    your appearance.
                  </p>
                </CardContent>
              </div>
              <Image
                width={160}
                height={96}
                src="/faceshape.jpg"
                alt="haircuts"
                className="rounded-lg w-full md:w-[160px] h-auto object-cover"
              />
            </Card>
            <svg height={60} id="hair-growth-essentials"></svg>
            <Card className="flex flex-col-reverse md:flex-row-reverse justify-between gap-4 p-4">
              <div>
                <CardTitle>
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Hair Growth Essentials
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">
                  Promote healthy habits.
                </CardDescription>
                <CardContent>
                  <p className="text-xs">
                    Promoting hair growth in men involves a combination of
                    healthy habits, proper scalp care, and effective products.
                    Eating a balanced diet rich in vitamins like biotin, Vitamin
                    D, and zinc can help strengthen hair from within. Staying
                    hydrated and reducing stress through regular exercise or
                    relaxation techniques can also support hair health. Gentle
                    scalp massages with oils like castor or rosemary oil are
                    believed to stimulate blood circulation and improve follicle
                    health. Products such as sulfate-free shampoos, conditioners
                    with keratin, and leave-in treatments with ingredients like
                    minoxidil are effective for boosting growth and thickening
                    hair. Avoiding harsh styling tools, excessive heat, and
                    tight hairstyles is crucial to prevent damage. Consistency
                    is key—adopting these habits regularly can significantly
                    enhance hair growth over time.
                  </p>
                </CardContent>
              </div>
              <Image
                width={160}
                height={96}
                src="/oil.jpg"
                alt="hair oil"
                className="rounded-lg w-full md:w-[160px] h-auto object-cover"
              />
            </Card>
            <svg height={60} id="why-mens-hair"></svg>
            <Card className="flex flex-col md:flex-row justify-between gap-4 p-4">
              <div>
                <CardTitle>
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Why Men&#39;s Hair?
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">
                  Why we do what we do.
                </CardDescription>
                <CardContent>
                  <p className="text-xs">
                    The team behind this website is deeply passionate about
                    exploring diverse styles of men&#39;s haircuts and
                    celebrating the rich traditions of barbershop culture. We
                    believe that hairstyling is more than just grooming—it&#39;s
                    an art form and a way to express individuality. The team
                    feels it&#39;s essential to educate men of all ages, as well
                    as parents with their children, on how to choose and
                    maintain hairstyles that suit their personalities,
                    lifestyles, and preferences. By providing valuable insights,
                    tips, and inspiration, ShearGenius aims to empower their
                    audience to approach men&#39;s hair styling with confidence
                    and creativity, fostering a greater appreciation for the
                    craftsmanship behind every great cut.
                  </p>
                </CardContent>
              </div>
              <Image
                width={160}
                height={96}
                src="/comb.jpg"
                alt="haircut"
                className="rounded-lg w-full md:w-[160px] h-auto object-cover"
              />
            </Card>
            <svg height={60} id="credits"></svg>
            <Card className="flex flex-col md:flex-row justify-between gap-4 p-4">
              <div>
                <CardTitle>
                  <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
                    Credits/Contact
                  </h1>
                </CardTitle>
                <CardDescription className="my-2">Created by:</CardDescription>
                <CardContent>
                  <div>
                    <p className="text-xs">Aaron Robinson</p>
                    <div className="flex gap-2">
                      <a href="#">
                        <Image
                          width={24}
                          height={24}
                          src="/gihublogoWHITE.png"
                          alt="github"
                          className="p-[.15rem]  bg-indigo-900 rounded-[50%]"
                        />
                      </a>
                      <a href="#">
                        <Image
                          width={24}
                          height={24}
                          src="/gmailicon.png"
                          alt="gmail"
                          className="p-1  rounded-xs"
                        />
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs">Darryl Patton</p>
                    <div className="flex gap-2">
                      <a href="#">
                        <Image
                          width={24}
                          height={24}
                          src="/gihublogoWHITE.png"
                          alt="github"
                          className="p-[.15rem]  bg-indigo-900 rounded-[50%]"
                        />
                      </a>
                      <a href="#">
                        <Image
                          width={24}
                          height={24}
                          src="/gmailicon.png"
                          alt="gmail"
                          className="p-1  rounded-xs"
                        />
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs">Hassan Sajid</p>
                    <div className="flex gap-2">
                      <a href="#">
                        <Image
                          width={24}
                          height={24}
                          src="/gihublogoWHITE.png"
                          alt="github"
                          className="p-[.15rem]  bg-indigo-900 rounded-[50%]"
                        />
                      </a>
                      <Link href="#">
                        <Image
                          width={24}
                          height={24}
                          src="/gmailicon.png"
                          alt="gmail"
                          className="p-1  rounded-xs"
                        />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
            <p>Powered with Azure, Next.js and shadcn UI</p>
          </div>
        </div>
      </div>
      <Footer />
    </SidebarProvider>
  );
}
