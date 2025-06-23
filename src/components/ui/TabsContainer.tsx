import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface TabItem {
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsContainerProps {
  tabs: TabItem[];
  variant?: 'enclosed' | 'line' | 'soft-rounded' | 'solid-rounded' | 'unstyled';
  size?: 'sm' | 'md' | 'lg' | { base: string; md: string };
  colorScheme?: string;
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export function TabsContainer({
  tabs,
  variant = 'enclosed',
  size = 'md',
  colorScheme = 'blue',
  defaultIndex = 0,
  onChange,
}: TabsContainerProps) {
  const sizeValue = typeof size === 'object' ? size.base : size;
  const mdSizeValue = typeof size === 'object' ? size.md : size;

  return (
    <Tabs
      variant={variant}
      size={sizeValue}
      colorScheme={colorScheme}
      defaultIndex={defaultIndex}
      onChange={onChange}
    >
      <TabList
        overflowX="auto"
        css={{
          scrollbarWidth: 'none',
          '::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={`tab-${tab.label}-${index}`}
            whiteSpace="nowrap"
            isDisabled={tab.disabled}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {tabs.map((tab, index) => (
          <TabPanel key={`panel-${tab.label}-${index}`}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
} 