interface Props {
  trivija: { tekst: string } | undefined;
}

export default function Trivija({ trivija }: Props) {
  return (
    <p>
      <b>Тривија:</b> {trivija?.tekst ?? "Нема тривије"}
    </p>
  );
}