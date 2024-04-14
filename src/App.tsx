import {
  Image,
  Slider,
  Text,
  Stack,
  Button,
  FileButton,
  Group,
  Container,
  Title,
  Grid,
  Box,
} from "@mantine/core";

import { useFaceForm, useFaceBlur } from "./hooks";

function App() {
  const { form } = useFaceForm();
  const { blurredImage, onSubmit } = useFaceBlur();

  return (
    <Container py="xl" h="100vh">
      <Title>自動顔ぼかしツール</Title>
      <Grid mt="xl" gutter="xl">
        <Grid.Col span={4}>
          <Stack pos="sticky" top={0}>
            <Group justify="center">
              <FileButton
                {...form.getInputProps("image")}
                accept="image/png,image/jpeg"
              >
                {(props) => (
                  <Button variant="light" color="grape" fullWidth {...props}>
                    画像を選択
                  </Button>
                )}
              </FileButton>
            </Group>
            <Box>
              <Text size="sm">顔の認識の閾値</Text>
              <Slider
                {...form.getInputProps("minConfidence")}
                color="grape"
                label={null}
                min={0.1}
                max={0.9}
                step={0.1}
                marks={[
                  { value: 0.1, label: "低" },
                  { value: 0.5, label: "中" },
                  { value: 0.9, label: "高" },
                ]}
              />
              <Text mt="xl" size="xs" c="gray">
                低いほど沢山の顔を認識しますが、誤りも増えます。
              </Text>
            </Box>
            <Box>
              <Text size="sm">ぼかし具合</Text>
              <Slider
                {...form.getInputProps("blurRatio")}
                mb="xl"
                color="grape"
                label={null}
                min={0.004}
                max={0.01}
                step={0.001}
                marks={[
                  { value: 0.004, label: "薄" },
                  { value: 0.007, label: "中" },
                  { value: 0.01, label: "濃" },
                ]}
              />
            </Box>
            <Button
              variant="gradient"
              gradient={{ from: "grape", to: "pink", deg: 90 }}
              fullWidth
              onClick={() => onSubmit(form.values)}
              disabled={!form.values.image}
            >
              ぼかす
            </Button>
            <Button
              mt="xl"
              variant="light"
              color="grape"
              fullWidth
              onClick={() => onSubmit(form.values)}
              disabled={!blurredImage}
            >
              ぼかした画像をダウンロード
            </Button>
          </Stack>
        </Grid.Col>
        <Grid.Col span="auto">
          {blurredImage && (
            <Image
              src={blurredImage}
              onLoad={() => URL.revokeObjectURL(blurredImage)}
              fit="contain"
            />
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default App;
