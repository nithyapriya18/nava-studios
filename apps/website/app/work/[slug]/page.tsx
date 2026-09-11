import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function WorkSlugRedirect({ params }: Props) {
  const { slug } = await params
  redirect(`/lab/${slug}`)
}
