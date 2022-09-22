import { useEffect, useState } from "react";
import { Button, ButtonVariant } from "@anoma/components";
import { GenerateMnemonicMsg } from "background/keyring";
import { ExtensionRequester } from "extension";
import { Ports } from "router";
import {
  AccountInformationViewContainer,
  AccountInformationViewUpperPartContainer,
  AccountInformationForm,
  Header1,
  BodyText,
  ButtonContainer,
  SeedPhraseCard,
  SeedPhraseContainer,
  SeedPhraseIndexLabel,
  ExportSeedPhraseButtonsContainer,
  CopyToClipboard,
} from "./SeedPhrase.components";

// this is being used:
// to store the data in the parent when editing
// when submitting the form
export type AccountCreationDetails = {
  seedPhraseLength?: string;
  accountName?: string;
  password?: string;
};

type AccountInformationViewProps = {
  requester: ExtensionRequester;
  // go to next screen
  onConfirm: (seedPhraseAsArray: string[]) => void;
  // depending if first load this might or might not be available
  accountCreationDetails?: AccountCreationDetails;
  // depending if first load this might or might not be available
  defaultSeedPhrase?: string[];
};

// saves the content to clipboard
const textToClipboard = (content: string): void => {
  navigator.clipboard.writeText(content);
};

const SeedPhrase = (props: AccountInformationViewProps): JSX.Element => {
  const { requester, onConfirm, defaultSeedPhrase } = props;
  const [seedPhrase, setSeedPhrase] = useState(defaultSeedPhrase || []);

  const isSubmitButtonDisabled = seedPhrase.length === 0;
  // TODO: User should be able to also choose 24!
  const seedPhraseLength = 12;

  useEffect(() => {
    // if a mnemonic was passed in we do not generate it again
    if (defaultSeedPhrase?.length && defaultSeedPhrase?.length > 0) return;

    const createMnemonic = async (): Promise<void> => {
      const words = await requester.sendMessage<GenerateMnemonicMsg>(
        Ports.Background,
        new GenerateMnemonicMsg(seedPhraseLength)
      );
      setSeedPhrase(words);
    };

    createMnemonic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountInformationViewContainer>
      {/* header */}
      <AccountInformationViewUpperPartContainer>
        <Header1>Seed Phrase</Header1>
      </AccountInformationViewUpperPartContainer>

      {/* form */}
      <AccountInformationForm>
        {/* description */}
        <BodyText>Write down your seed phrase.</BodyText>
        <SeedPhraseContainer>
          {seedPhrase.map((word, index) => {
            return (
              <SeedPhraseCard key={`${word}:${index}`}>
                <SeedPhraseIndexLabel>{`${index + 1}`}</SeedPhraseIndexLabel>
                {`${word}`}
              </SeedPhraseCard>
            );
          })}
        </SeedPhraseContainer>

        <ExportSeedPhraseButtonsContainer>
          {/* copy seed phrase */}
          <CopyToClipboard
            onClick={() => {
              textToClipboard(seedPhrase.join(" "));
            }}
            href="#"
          >
            Copy to clipboard
          </CopyToClipboard>
        </ExportSeedPhraseButtonsContainer>

        {/* continue */}
        <ButtonContainer>
          <Button
            onClick={() => {
              onConfirm(seedPhrase);
            }}
            disabled={isSubmitButtonDisabled}
            variant={ButtonVariant.Contained}
          >
            I wrote down my mnemonic
          </Button>
        </ButtonContainer>
      </AccountInformationForm>
    </AccountInformationViewContainer>
  );
};

export default SeedPhrase;
