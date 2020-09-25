function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Units Settings</Text>}>
       <Select
        label={`Default Units`}
        settingsKey="selection"
        options={[
          {name:"fl. Oz"},
          {name:"mL"}
        ]}
        onSelection={(selection) => console.log(selection)}
      />
      </Section>
    </Page>
  );
}

// add custom values later
registerSettingsPage(mySettings);
