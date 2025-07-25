"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/container/Navbar/Navbar";
import Footer from "../components/container/Footer";
import Container from "../components/common/Container";
import MarkdownIt from "markdown-it";
import Head from "next/head";

import {
  callBackendApi,
  getDomain,
  getImagePath,
  robotsTxt,
} from "@/lib/myFun";

import FullContainer from "@/components/common/FullContainer";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import useBreadcrumbs from "@/lib/useBreadcrumbs";
import { useRouter } from "next/router";

export default function TermsAndConditions({
  logo,
  imagePath,
  phone,
  services,
  domain,
  favicon,
  meta,
  footer,
  terms,
  contact_info,
  city_name,
}) {
  const markdownIt = new MarkdownIt();
  const content = markdownIt.render(
    terms
      ?.replaceAll("##city_name##", city_name)
      ?.replaceAll("##website##", `${domain}`)
      ?.replaceAll("##phone##", `${phone}`)
      ?.replaceAll("(805) 628-4877", `${phone}`)
      ?.replaceAll("(408) 762-6429", `${phone}`)
      ?.replaceAll("(408) 762-6407", `${phone}`)
      ?.replaceAll("(408) 762-6323", `${phone}`)
  );
  const breadcrumbs = useBreadcrumbs();
  const router = useRouter();
  const currentPath = router.asPath;

  useEffect(() => {
    if (currentPath.includes("%20") || currentPath.includes(" ")) {
      router.replace("/terms-and-conditions");
    }
  }, [currentPath, router]);

  return (
    <main>
      <Head>
        <meta charSet="UTF-8" />
        <title>{meta?.title?.replaceAll("##city_name##", city_name)}</title>
        <meta
          name="description"
          content={meta?.description?.replaceAll("##city_name##", city_name)}
        />
        <link rel="author" href={`https://${domain}`} />
        <link rel="publisher" href={`https://${domain}`} />
        <link rel="canonical" href={`https://${domain}/terms-and-conditions`} />
        <meta name="theme-color" content="#008DE5" />
        <link rel="manifest" href="/manifest.json" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="zbriSQArMtpCR3s5simGqO5aZTDqEZZi9qwinSrsRPk"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${imagePath}/${favicon}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${imagePath}/${favicon}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${imagePath}/${favicon}`}
        />
      </Head>

      <Navbar
        phone={phone}
        logo={logo}
        imagePath={imagePath}
        services={services}
      />

      <FullContainer>
        <Container>
          <Breadcrumbs breadcrumbs={breadcrumbs} className="py-7" />

          <div
            className="prose prose-h2:!text-start prose-p:!text-[20px] text-primary max-w-full w-full mb-5"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      </FullContainer>

      <Footer
        domain={domain}
        data={footer}
        logo={logo}
        imagePath={imagePath}
        contact_info={contact_info}
        phone={phone}
      />
    </main>
  );
}

export async function getServerSideProps({ req }) {
  const domain = getDomain(req?.headers?.host);
  const logo = await callBackendApi({ domain, tag: "logo" });
  const project_id = logo?.data[0]?.project_id || null;
  const imagePath = await getImagePath(project_id, domain);
  const gtmId = await callBackendApi({ domain, tag: "gtmId" });
  const gtm_head = await callBackendApi({ domain, tag: "gtm_head" });
  const gtm_body = await callBackendApi({ domain, tag: "gtm_body" });

  const contact_info = await callBackendApi({ domain, tag: "contact_info" });
  const banner = await callBackendApi({ domain, tag: "banner" });
  const phone = await callBackendApi({ domain, tag: "phone" });
  const services = await callBackendApi({ domain, tag: "services_list" });
  const features = await callBackendApi({ domain, tag: "features" });
  const gallery = await callBackendApi({ domain, tag: "gallery" });
  const about = await callBackendApi({ domain, tag: "about" });
  const benefits = await callBackendApi({ domain, tag: "benefits" });
  const testimonials = await callBackendApi({ domain, tag: "testimonials" });
  const meta = await callBackendApi({ domain, tag: "meta_terms" });
  const favicon = await callBackendApi({ domain, tag: "favicon" });
  const footer = await callBackendApi({ domain, tag: "footer" });
  const locations = await callBackendApi({ domain, tag: "locations" });
  const terms = await callBackendApi({ domain, tag: "terms" });
  const city_name = await callBackendApi({ domain, tag: "city_name" });

  let project;
  if (project_id) {
    try {
      const projectInfoResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_MANAGER}/api/public/get_project_info/${project_id}`
      );

      if (projectInfoResponse.ok) {
        const projectInfoData = await projectInfoResponse.json();
        project = projectInfoData?.data || null;
        console.log("project (server-side):", project);
      } else {
        console.error(
          "Failed to fetch project info:",
          projectInfoResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching project info:", error);
    }
  }

  robotsTxt({ domain });

  return {
    props: {
      domain,
      imagePath,
      logo: logo?.data[0] || null,
      gtm_head: gtm_head?.data[0]?.value || null,
      gtm_body: gtm_body?.data[0]?.value || null,

      banner: banner?.data[0] || null,
      phone: phone?.data[0]?.value || null,
      services: services?.data[0]?.value || [],
      features: features?.data[0] || [],
      gallery: gallery?.data[0]?.value || [],
      about: about?.data[0] || null,
      benefits: benefits?.data[0] || [],
      testimonials: testimonials?.data[0]?.value || [],
      meta: meta?.data[0]?.value || null,
      favicon: favicon?.data[0]?.file_name || null,
      footer: footer?.data[0] || null,
      locations: locations?.data[0]?.value || [],
      terms: terms?.data[0]?.value || null,
      gtmId: gtmId?.data[0]?.value || null,
      contact_info: contact_info?.data[0]?.value || null,
      city_name: city_name?.data[0]?.value || null,
      phone: project?.phone || "(000) 000-0000",
    },
  };
}
